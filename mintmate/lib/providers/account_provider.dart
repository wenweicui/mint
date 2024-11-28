import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintmate/providers/transaction_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/account.dart';
import '../services/database_service.dart';
import 'package:sqflite/sqflite.dart';
import 'package:uuid/uuid.dart';

final accountsProvider =
    StateNotifierProvider<AccountsNotifier, List<Account>>((ref) {
  final dbService = ref.watch(databaseServiceProvider);
  return AccountsNotifier(dbService);
});

class AccountsNotifier extends StateNotifier<List<Account>> {
  final DatabaseService _dbService;
  final _uuid = const Uuid();

  AccountsNotifier(this._dbService) : super([]) {
    loadAccounts();
  }

  Future<void> loadAccounts() async {
    final db = await _dbService.database;
    final List<Map<String, dynamic>> maps = await db.query('accounts');

    if (maps.isEmpty) {
      // Create default account if no accounts exist
      await createDefaultAccount();
      // Fetch accounts again after creating default
      final updatedMaps = await db.query('accounts');
      state = updatedMaps.map((map) => Account.fromMap(map)).toList();
    } else {
      state = maps.map((map) => Account.fromMap(map)).toList();
    }
  }

  Future<void> createDefaultAccount() async {
    final defaultAccount = Account(
      id: _uuid.v4(),
      name: 'Default Account',
      type: AccountType.checking,
      balance: 0.0,
      currency: 'USD',
    );

    final db = await _dbService.database;
    await db.insert('accounts', defaultAccount.toMap());
  }

  // Check if an account exists
  Future<bool> hasAccounts() async {
    final db = await _dbService.database;
    final count = Sqflite.firstIntValue(
      await db.rawQuery('SELECT COUNT(*) FROM accounts'),
    );
    return (count ?? 0) > 0;
  }

  // Get default account
  Future<Account?> getDefaultAccount() async {
    final db = await _dbService.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'accounts',
      limit: 1,
    );

    if (maps.isNotEmpty) {
      return Account.fromMap(maps.first);
    }
    return null;
  }

  Future<void> addAccount(Account account) async {
    // Always generate a new UUID for new accounts
    final accountWithId = Account(
      id: null, // This will force UUID generation in the constructor
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
    );

    final db = await _dbService.database;
    try {
      await db.insert(
        'accounts',
        accountWithId.toMap(),
        conflictAlgorithm: ConflictAlgorithm.abort,
      );
      await loadAccounts();
    } catch (e) {
      print('Error adding account: $e');
      rethrow;
    }
  }

  Future<void> updateAccount(Account account) async {
    final db = await _dbService.database;
    await db.update(
      'accounts',
      account.toMap(),
      where: 'id = ?',
      whereArgs: [account.id],
    );
    await loadAccounts();
  }

  Future<void> updateAccountBalance(String accountId, double amount) async {
    final db = await _dbService.database;

    // First get the current account
    final List<Map<String, dynamic>> maps = await db.query(
      'accounts',
      where: 'id = ?',
      whereArgs: [accountId],
    );

    if (maps.isNotEmpty) {
      final account = Account.fromMap(maps.first);
      final updatedAccount = Account(
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance + amount,
        currency: account.currency,
      );

      await db.update(
        'accounts',
        updatedAccount.toMap(),
        where: 'id = ?',
        whereArgs: [accountId],
      );

      await loadAccounts();
    }
  }

  Future<void> clearAllAccounts() async {
    try {
      await _dbService.clearTable('accounts');
      state = [];
    } catch (e) {
      print('Error clearing accounts: $e');
      rethrow;
    }
  }

  Future<void> clearAccounts() async {
    state = [];
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accounts');
  }
}
