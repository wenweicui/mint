import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/theme_service.dart';
import '../services/biometric_service.dart';

final themeServiceProvider = Provider<ThemeService>((ref) => ThemeService());
final biometricServiceProvider =
    Provider<BiometricService>((ref) => BiometricService());

final themeModeProvider =
    StateNotifierProvider<ThemeModeNotifier, ThemeMode>((ref) {
  return ThemeModeNotifier(ref.watch(themeServiceProvider));
});

final biometricEnabledProvider =
    StateNotifierProvider<BiometricEnabledNotifier, bool>((ref) {
  return BiometricEnabledNotifier(ref.watch(biometricServiceProvider));
});

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  final ThemeService _themeService;

  ThemeModeNotifier(this._themeService) : super(ThemeMode.system) {
    _init();
  }

  void _init() async {
    state = await _themeService.getThemeMode();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    await _themeService.setThemeMode(mode);
    state = mode;
  }
}

class BiometricEnabledNotifier extends StateNotifier<bool> {
  final BiometricService _biometricService;

  BiometricEnabledNotifier(this._biometricService) : super(false) {
    _init();
  }

  void _init() async {
    state = await _biometricService.getBiometricEnabled();
  }

  Future<void> setBiometricEnabled(bool enabled) async {
    if (enabled) {
      final isAvailable = await _biometricService.isBiometricAvailable();
      if (!isAvailable) {
        throw Exception(
            'Biometric authentication is not available on this device');
      }
      final authenticated = await _biometricService.authenticate();
      if (!authenticated) {
        throw Exception('Biometric authentication failed');
      }
    }
    await _biometricService.setBiometricEnabled(enabled);
    state = enabled;
  }
}
