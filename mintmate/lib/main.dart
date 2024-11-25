import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mintmate/firebase_options.dart';
import 'package:mintmate/providers/mock_data_provider.dart';
import 'package:mintmate/screens/home/home_screen.dart';
import 'config/theme.dart';
import 'config/routes.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  runApp(
    ProviderScope(
      child: Builder(
        builder: (context) {
          // Initialize mock data
          if (kDebugMode) {
            // Only in debug mode
            Future.delayed(const Duration(milliseconds: 500), () {
              ProviderScope.containerOf(context)
                  .read(mockDataProvider)
                  .initializeMockData();
            });
          }
          return const BookkeepingApp();
        },
      ),
    ),
  );
}

class BookkeepingApp extends StatelessWidget {
  const BookkeepingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bookkeeping App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      initialRoute: AppRoutes.home,
      onGenerateRoute: AppRoutes.onGenerateRoute,
      home: const HomeScreen(),
    );
  }
}
