import 'package:flutter/material.dart';
import '../screens/statistics/statistics_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/transactions/transaction_screen.dart';
import '../screens/settings/settings_screen.dart';

class AppRoutes {
  static const String home = '/';
  static const String transactions = '/transactions';
  static const String settings = '/settings';
  static const String statistics = '/statistics';

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case transactions:
        return MaterialPageRoute(builder: (_) => const TransactionScreen());
      case settings:
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      case statistics:
        return MaterialPageRoute(builder: (_) => const StatisticsScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${routeSettings.name}'),
            ),
          ),
        );
    }
  }
}
