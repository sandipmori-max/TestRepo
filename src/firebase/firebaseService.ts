import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/**
 * Request permission for push notifications (iOS requires explicit).
 */

export async function requestUserPermission(): Promise<void> {
  try {
    const authStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      badge: true,
      carPlay: true,
      criticalAlert: true,
      provisional: true,
    });

    switch (authStatus) {
      case messaging.AuthorizationStatus.AUTHORIZED:
        await getFcmToken();
        break;

      case messaging.AuthorizationStatus.PROVISIONAL:
        await getFcmToken();
        break;

      case messaging.AuthorizationStatus.DENIED:
        Alert.alert(
          'Permission Denied',
          'You have denied notification permission. Please enable it in Settings to receive alerts.'
        );
        break;

      case messaging.AuthorizationStatus.NOT_DETERMINED:
        Alert.alert(
          'Permission Not Determined',
          'Please decide whether to allow notifications to stay updated.'
        );
        break;

      default:
        console.log('ℹ️ Push notification permission status:', authStatus);
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}

/**
 * Get FCM token for the device.
 */
export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    if (token) {
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Foreground notification listener.
 */
export function onMessageListener(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return messaging().onMessage(async remoteMessage => {
    callback(remoteMessage);
  });
}

/**
 * Background notification handler.
 */
export function setBackgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('📩 Background message:', remoteMessage);
      // You can trigger a local notification here if needed
    }
  );
}

/**
 * App opened from background (user taps on notification).
 */
export function onNotificationOpenedAppListener(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage) {
      console.log('📩 Opened from background:', remoteMessage);
      callback(remoteMessage);
    }
  });
}

/**
 * App opened from killed/quit state (user taps on notification).
 */
export async function checkInitialNotification(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('📩 Opened from quit state:', remoteMessage);
    callback(remoteMessage);
  }
}
