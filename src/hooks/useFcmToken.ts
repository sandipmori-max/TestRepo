import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, Platform } from 'react-native';

const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const permission = await requestUserPermission();
        setPermissionGranted(permission);

        if (permission) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            setToken(fcmToken);
          }
        }
      } catch (err) {
        console.error('FCM Initialization error:', err);
      }
    };

    initializeFCM();

    const unsubscribe = messaging().onTokenRefresh(newToken => {
      setToken(newToken);
    });

    return unsubscribe;
  }, []);

 const requestUserPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        provisional: true,
      });

      switch (authStatus) {
        case messaging.AuthorizationStatus.AUTHORIZED:
          return true;

        case messaging.AuthorizationStatus.PROVISIONAL:
          return true;

        case messaging.AuthorizationStatus.DENIED:
          Alert.alert(
            'Permission Denied',
            'You denied notification permission. To enable notifications, please go to Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return false;

        case messaging.AuthorizationStatus.NOT_DETERMINED:
          Alert.alert(
            'Permission Not Determined',
            'Please allow notifications to stay updated.'
          );
          return false;

        default:
          console.log('ℹ️ Push notification permission status:', authStatus);
          return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // ✅ Android always returns true (but Android 13+ still needs runtime request)
  return true;
};

  return { token, permissionGranted };
};

export default useFcmToken;
