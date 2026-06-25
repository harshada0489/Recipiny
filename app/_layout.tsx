import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { initDb } from '@/db';
import { seedIfEmpty } from '@/db/seed';
import { colors } from '@/theme/colors';
import { AuthProvider, useAuth } from '@/auth/context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        await seedIfEmpty();
      } catch (e) {
        console.warn('DB init failed', e);
      } finally {
        setDbReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return <FullScreenSpinner />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * Sits between AuthProvider and the navigation Stack. Reads the auth state
 * and redirects the user so that:
 *   - Signed-out users only see /auth/* screens
 *   - Signed-in users only see the main app
 *
 * Without this guard, expo-router would happily render the Home tab to a
 * signed-out user.
 */
function AuthGate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Signed out, somewhere in the app → bounce to Sign In.
      router.replace('/auth/signin');
    } else if (user && inAuthGroup) {
      // Signed in but still on an auth screen → into the main app.
      router.replace('/');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="recipe/[id]" />
      <Stack.Screen
        name="cook/[id]"
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="import"
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
      <Stack.Screen name="auth" />
    </Stack>
  );
}

function FullScreenSpinner() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}
