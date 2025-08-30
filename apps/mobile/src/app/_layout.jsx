
import { useAuth } from '@/utils/auth/useAuth';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeNotificationListeners, requestNotificationPermissions, handleNotificationReceived } from '../utils/notificationUtils';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
      
      // Initialize notifications with proper handlers
      requestNotificationPermissions();
      const cleanup = initializeNotificationListeners(router);
      
      // Set up foreground notification handler
      const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
      
      return () => {
        cleanup();
        notificationListener.remove();
      };
    }
  }, [isReady, router]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
