import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction.dart';
import '../services/database_service.dart';

final databaseServiceProvider = Provider<DatabaseService>((ref) {
  return DatabaseService();
});

final transactionsProvider =
    StateNotifierProvider<TransactionsNotifier, List<FinancialTransaction>>(
        (ref) {
  final dbService = ref.watch(databaseServiceProvider);
  return TransactionsNotifier(dbService);
});

class TransactionsNotifier extends StateNotifier<List<FinancialTransaction>> {
  final DatabaseService _dbService;

  TransactionsNotifier(this._dbService) : super([]) {
    loadTransactions();
  }

  Future<void> loadTransactions() async {
    final db = await _dbService.database;
    final List<Map<String, dynamic>> maps = await db.query('transactions');
    state = maps.map((map) => FinancialTransaction.fromMap(map)).toList();
  }

  Future<void> addTransaction(FinancialTransaction transaction) async {
    final db = await _dbService.database;
    await db.insert('transactions', transaction.toMap());
    await loadTransactions();
  }

  Future<void> deleteTransaction(String id) async {
    final db = await _dbService.database;
    await db.delete(
      'transactions',
      where: 'id = ?',
      whereArgs: [id],
    );
    await loadTransactions();
  }

  Future<void> clearAllTransactions() async {
    try {
      await _dbService.clearTable('transactions');
      state = [];
    } catch (e) {
      print('Error clearing transactions: $e');
      rethrow;
    }
  }

  Future<void> clearTransactions() async {
    state = [];
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('transactions');
  }
}
