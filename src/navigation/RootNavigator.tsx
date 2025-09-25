import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, NativeModules, Alert, Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStateThunk } from '../store/slices/auth/thunk';
import DevERPService from '../services/api/deverp';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import FullViewLoader from '../components/loader/FullViewLoader';
import DeviceInfo from 'react-native-device-info';
import CustomAlert from '../components/alert/CustomAlert';
import { generateGUID } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestLocationPermissions } from '../utils/helpers';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, accounts } = useAppSelector(state => state.auth);
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });
  const [hasSyncedDisabledLocation, setHasSyncedDisabledLocation] = useState(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (alreadyGranted) return true;

        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];
        if (Platform.Version >= 34) {
          permissions.push(PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE_LOCATION);
        }

        const results = await PermissionsAndroid.requestMultiple(permissions);

        let allGranted = true;
        let permanentlyDenied = false;

        for (const [perm, status] of Object.entries(results)) {
          if (status !== PermissionsAndroid.RESULTS.GRANTED) {
            allGranted = false;
            if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              permanentlyDenied = true;
            }
          }
        }

        if (allGranted) return true;
        if (permanentlyDenied) {
          setIsSettingVisible(true);
          // Alert.alert(
          //   'Permission Blocked',
          //   'Location permission is permanently denied. Please enable it in Settings.',
          //   [
          //     { text: 'Cancel', style: 'cancel' },
          //     { text: 'Open Settings', onPress: () => Linking.openSettings() },
          //   ],
          // );
          // -------------------
          setAlertConfig({
            title: 'Permission Blocked',
            message: 'Location permission is permanently denied. Please enable it in Settings.',
            type: 'error',
          });
          setAlertVisible(true);
          return false;
        }

        Alert.alert('Permission Denied', 'Location permission is required for this feature.');
        setIsSettingVisible(false);
        return false;
      } catch (err) {
        console.warn('⚠️ requestLocationPermission error:', err);
        return false;
      }
    }
    return true;
  };

  const app_id = generateGUID();

  useEffect(() => {
    const fetchDeviceName = async () => {
      const name = await DeviceInfo.getDeviceName();
      let appid = await AsyncStorage.getItem('appid');
      if (!appid) {
        appid = app_id;
        await AsyncStorage.setItem('appid', appid);
      }
      await AsyncStorage.setItem('device', name);

      DevERPService.initialize();
      DevERPService.setAppId(appid);
      DevERPService.setDevice(name);

      dispatch(checkAuthStateThunk());
    };
    fetchDeviceName();
  }, [dispatch]);

  // Location & permissions watcher
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkAndStart = async () => {
      if (!isAuthenticated) return;

      try {
        // Check if device location is enabled
        const enabled = await DeviceInfo.isLocationEnabled();
        if (!enabled) {
          // setAlertConfig({
          //   title: 'Location Status',
          //   message:
          //     'To continue using our services, please enable location access. Without location permissions, you won’t be able to use this app',
          //   type: 'error',
          // });
          // setAlertVisible(true);
          return;
        }

        // Check location permissions
        const hasPermission = await requestLocationPermission();
        const fullPermission = await requestLocationPermissions();

        if (!hasPermission || !fullPermission) {
          setAlertConfig({
            title: 'Location Status',
            message:
              'To continue using our services, please enable location access. Without location permissions, you won’t be able to use this app',
            type: 'error',
          });
          setAlertVisible(true);
          return;
        }

        // Start interval only when all conditions satisfied
        interval = setInterval(() => {
          console.log('📌 Running location sync...');
          checkLocation();
        }, 1800);
      } catch (err) {
        console.warn('⚠️ checkAndStart error:', err);
      }
    };

    checkAndStart();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, accounts]);

  const checkLocation = async () => {
    try {
      if (!isAuthenticated) return;

      const enabled = await DeviceInfo.isLocationEnabled();

      if (locationEnabled === null) {
        if (!enabled) {
          setAlertConfig({
            title: 'Location Status',
            message:
              'To continue using our services, please enable location access. Without location permissions, you won’t be able to use this app',
            type: 'error',
          });
          setAlertVisible(true);
        }
        setLocationEnabled(enabled);
        return;
      }

      if (enabled !== locationEnabled) {
        setAlertConfig({
          title: 'Location Status',
          message: enabled
            ? `Location is now enabled`
            : 'To continue using our services, please enable location access. Without location permissions, you won’t be able to use this app',
          type: enabled ? 'success' : 'error',
        });
        setAlertVisible(true);
      }

      setModalClose(enabled);
      setLocationEnabled(enabled);

      if (isAuthenticated) {
        if (enabled) {
          setHasSyncedDisabledLocation(false);

          const hasPermission = await requestLocationPermission();
          if (!hasPermission) return;

          if (accounts.length > 0 && Platform.OS === 'android') {
            const granted = await requestLocationPermissions();
            console.log('🚀 ~ checkLocation ~ granted:', granted);
            if (granted && isAuthenticated) {
              const data = accounts.map(u => ({
                token: u?.user?.token,
                link: u?.user?.companyLink,
              }));

              NativeModules.LocationModule.setUserTokens(data);
              NativeModules.LocationModule?.startService();
            } else {
              setAlertConfig({
                title: 'Location Status',
                message:
                  'To continue using our services, please enable location access. Without location permissions, you won’t be able to use this app',
                type: 'error',
              });
              setAlertVisible(true);
              setModalClose(false);
            }
          }
        }
      }
    } catch (err) {
      console.log('Location fetch error:', err);
    }
  };

  if (isLoading) return <FullViewLoader />;

  return (
    <>
      {isAuthenticated ? <StackNavigator /> : <AuthNavigator />}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => {
          if (modalClose) setAlertVisible(false);
        }}
        actionLoader={undefined}
        isSettingVisible={isSettingVisible}
      />
    </>
  );
};

export default RootNavigator;
