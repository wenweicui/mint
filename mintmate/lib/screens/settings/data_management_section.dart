import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintmate/providers/data_provider.dart';
import 'package:mintmate/providers/account_provider.dart';
import 'package:mintmate/providers/transaction_provider.dart';

class DataManagementSection extends ConsumerWidget {
  const DataManagementSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            'Data Management',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ListTile(
          leading: const Icon(Icons.backup_outlined),
          title: const Text('Export Data'),
          subtitle: const Text('Export your data as CSV'),
          onTap: () => _exportData(context, ref),
        ),
        ListTile(
          leading: const Icon(Icons.restore),
          title: const Text('Import Data'),
          subtitle: const Text('Import data from backup'),
          onTap: () => _importData(context, ref),
        ),
        ListTile(
          leading: const Icon(Icons.delete_outline, color: Colors.red),
          title: const Text(
            'Clear All Data',
            style: TextStyle(color: Colors.red),
          ),
          onTap: () => _showClearDataDialog(context, ref),
        ),
      ],
    );
  }

  Future<void> _exportData(BuildContext context, WidgetRef ref) async {
    final dataService = ref.read(dataServiceProvider);
    final accounts = ref.read(accountsProvider);
    final transactions = ref.read(transactionsProvider);

    try {
      final message = await dataService.exportData(accounts, transactions);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message)),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to export data: $e')),
        );
      }
    }
  }

  Future<void> _importData(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(dataServiceProvider).importData();
      // Refresh providers after import
      ref.refresh(accountsProvider);
      ref.refresh(transactionsProvider);

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Data imported successfully')),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to import data: $e')),
        );
      }
    }
  }

  Future<void> _showClearDataDialog(BuildContext context, WidgetRef ref) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Data'),
        content: const Text(
          'This action cannot be undone. Are you sure you want to clear all data?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear All'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        // Show loading indicator
        if (context.mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => const Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // Clear data from providers
        await ref.read(accountsProvider.notifier).clearAccounts();
        await ref.read(transactionsProvider.notifier).clearTransactions();

        // Clear all data from shared preferences
        await ref.read(dataServiceProvider).clearAllData();

        // Close loading indicator
        if (context.mounted) {
          Navigator.of(context).pop();
        }

        // Show success message
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('All data has been cleared'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        // Close loading indicator if it's showing
        if (context.mounted) {
          Navigator.of(context).pop();
        }

        // Show error message
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to clear data: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
}
