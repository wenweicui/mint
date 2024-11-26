import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/app_providers.dart';

class PreferencesSection extends ConsumerWidget {
  const PreferencesSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final biometricEnabled = ref.watch(biometricEnabledProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            'Preferences',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ListTile(
          leading: const Icon(Icons.palette_outlined),
          title: const Text('Theme'),
          subtitle: Text(_getThemeText(themeMode)),
          onTap: () => _showThemeSelector(context, ref),
        ),
        SwitchListTile(
          secondary: const Icon(Icons.fingerprint),
          title: const Text('Biometric Authentication'),
          subtitle: const Text('Use fingerprint or face ID to open app'),
          value: biometricEnabled,
          onChanged: (value) async {
            try {
              await ref
                  .read(biometricEnabledProvider.notifier)
                  .setBiometricEnabled(value);
            } catch (e) {
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(e.toString())),
                );
              }
            }
          },
        ),
      ],
    );
  }

  String _getThemeText(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.system:
        return 'System Default';
      case ThemeMode.light:
        return 'Light';
      case ThemeMode.dark:
        return 'Dark';
    }
  }

  void _showThemeSelector(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => SimpleDialog(
        title: const Text('Select Theme'),
        children: [
          SimpleDialogOption(
            onPressed: () {
              ref
                  .read(themeModeProvider.notifier)
                  .setThemeMode(ThemeMode.system);
              Navigator.pop(context);
            },
            child: const Text('System Default'),
          ),
          SimpleDialogOption(
            onPressed: () {
              ref
                  .read(themeModeProvider.notifier)
                  .setThemeMode(ThemeMode.light);
              Navigator.pop(context);
            },
            child: const Text('Light'),
          ),
          SimpleDialogOption(
            onPressed: () {
              ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
              Navigator.pop(context);
            },
            child: const Text('Dark'),
          ),
        ],
      ),
    );
  }
}
