import 'dart:io';
import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction.dart';
import '../models/account.dart';

class DataService {
  final ListToCsvConverter _csvConverter = const ListToCsvConverter();

  Future<String> exportData(
      List<Account> accounts, List<FinancialTransaction> transactions) async {
    // Create CSV data for accounts
    final accountsData = [
      ['Account ID', 'Name', 'Balance', 'Type'], // Header
      ...accounts.map((account) => [
            account.id,
            account.name,
            account.balance,
            account.type.toString(),
          ]),
    ];

    // Create CSV data for transactions
    final transactionsData = [
      [
        'Transaction ID',
        'Date',
        'Amount',
        'Type',
        'Category',
        'Description',
        'Account ID'
      ], // Header
      ...transactions.map((transaction) => [
            transaction.id,
            transaction.date.toIso8601String(),
            transaction.amount,
            transaction.type.toString(),
            transaction.category,
            transaction.description,
            transaction.accountId,
          ]),
    ];

    // Convert to CSV strings
    final accountsCsv = _csvConverter.convert(accountsData);
    final transactionsCsv = _csvConverter.convert(transactionsData);

    // Get temporary directory
    final directory = await getTemporaryDirectory();
    final timestamp = DateTime.now().millisecondsSinceEpoch;

    // Create files
    final accountsFile = File('${directory.path}/accounts_$timestamp.csv');
    final transactionsFile =
        File('${directory.path}/transactions_$timestamp.csv');

    // Write data to files
    await accountsFile.writeAsString(accountsCsv);
    await transactionsFile.writeAsString(transactionsCsv);

    // Create a zip file containing both CSVs
    // final zipFile = File('${directory.path}/bookkeeping_export_$timestamp.zip');
    // TODO: Implement zip functionality if needed

    // Share the files
    await Share.shareXFiles(
      [XFile(accountsFile.path), XFile(transactionsFile.path)],
      subject: 'Bookkeeping Data Export',
    );

    return 'Data exported successfully';
  }

  Future<void> importData() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv'],
        allowMultiple: true,
      );

      if (result == null) return;

      for (final file in result.files) {
        if (file.path == null) continue;

        final csvFile = File(file.path!);
        final csvData = await csvFile.readAsString();
        final rows = const CsvToListConverter().convert(csvData);

        if (rows.isEmpty) continue;

        final header =
            rows.first.map((e) => e.toString().toLowerCase()).toList();

        if (header.contains('account id')) {
          await _importAccounts(rows.skip(1).toList());
        } else if (header.contains('transaction id')) {
          await _importTransactions(rows.skip(1).toList());
        }
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _importAccounts(List<List<dynamic>> rows) async {
    // TODO: Implement account import logic using your account provider
    for (final row in rows) {
      final account = Account(
        id: row[0].toString(),
        name: row[1].toString(),
        balance: double.parse(row[2].toString()),
        currency: 'CAD',
        type: AccountType.values.firstWhere(
          (type) => type.toString() == row[3].toString(),
          orElse: () => AccountType.checking,
        ),
      );
      // Add to your account provider
    }
  }

  Future<void> _importTransactions(List<List<dynamic>> rows) async {
    // TODO: Implement transaction import logic using your transaction provider
    for (final row in rows) {
      final transaction = FinancialTransaction(
        id: row[0].toString(),
        date: DateTime.parse(row[1].toString()),
        amount: double.parse(row[2].toString()),
        type: TransactionType.values.firstWhere(
          (type) => type.toString() == row[3].toString(),
          orElse: () => TransactionType.expense,
        ),
        category: row[4].toString(),
        description: row[5].toString(),
        accountId: row[6].toString(),
      );
      // Add to your transaction provider
    }
  }

  Future<void> clearAllData() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Clear all accounts
      await prefs.remove('accounts');

      // Clear all transactions
      await prefs.remove('transactions');

      // Clear any other app-related data
      await prefs.remove('last_sync_time');
      // Add any other keys that need to be cleared

      // Alternatively, to clear everything:
      // await prefs.clear();
    } catch (e) {
      throw Exception('Failed to clear data: $e');
    }
  }
}
