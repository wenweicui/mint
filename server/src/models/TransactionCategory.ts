interface ITransactionCategory {
  primary: string;
  detailed: string;
  description: string;
}

class TransactionCategory implements ITransactionCategory {
  private static categories: TransactionCategory[] | null = null;

  constructor(
    public readonly primary: string,
    public readonly detailed: string,
    public readonly description: string
  ) {}

  static initialize(): void {
    // Skip if already initialized
    if (TransactionCategory.categories !== null) return;

    const fs = require('fs');
    const path = require('path');
    const csvPath = path.join(__dirname, '../../category-meta.csv');
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n');
    
    TransactionCategory.categories = lines
      .slice(1)
      .filter((line: string) => line.trim())
      .map((line: string) => {
        const [primary, detailed, description] = line
          .match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g)!
          .map(item => item.replace(/^,/, ''))
          .map(item => item.replace(/^"|"$/g, ''))
          .map(item => item.trim());
        
        return new TransactionCategory(primary, detailed, description);
      });
  }

  static getAllCategories(): TransactionCategory[] {
    if (TransactionCategory.categories === null) {
      this.initialize();
    }
    return TransactionCategory.categories!;
  }

  static getPrimaryCategories(): string[] {
    return [...new Set(this.getAllCategories().map(cat => cat.primary))];
  }

  static getDetailedCategoriesByPrimary(primary: string): string[] {
    return this.getAllCategories()
      .filter(cat => cat.primary === primary)
      .map(cat => cat.detailed);
  }

  static findByDetailed(detailed: string): TransactionCategory | undefined {
    return this.getAllCategories()
      .find(cat => cat.detailed === detailed);
  }
}

export default TransactionCategory; 