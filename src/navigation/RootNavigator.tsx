import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  PermissionsAndroid,
  Platform,
  NativeModules,
  AppState,
} from 'react-native';
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
import { useFocusEffect } from '@react-navigation/native';
import { setERPTheme } from '../utils/constants';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, accounts , user} = useAppSelector(state => state.auth);
  console.log("🚀 ~ RootNavigator ------------------ Active user ~ user:", user)
  const theme = useAppSelector(state => state.theme);

  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const isCheckingPermission = useRef(false);
  const locationSyncInterval = useRef<NodeJS.Timeout | null>(null);

  const app_id = user?.app_id;
  console.log("🚀 ~ RootNavigator ~ app_id:", app_id)

  // ------------------------- Request Location Permission -------------------------
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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

        for (const [_, status] of Object.entries(results)) {
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
          setAlertConfig({
            title: 'Permission Blocked',
            message: 'Location permission is permanently denied. Please enable it in Settings.',
            type: 'error',
          });
          setAlertVisible(true);
          return false;
        }

        setIsSettingVisible(false);
        return false;
      } catch (err) {
        console.warn('⚠️ requestLocationPermission error:', err);
        return false;
      }
    }
    return true;
  };

const lastLocationEnabled = useRef<boolean | null>(null);

useEffect(() => {
  setERPTheme('light');
}, [theme]);

useEffect(() => {
  const interval = setInterval(async () => {
    const enabled = await DeviceInfo.isLocationEnabled();

    if (lastLocationEnabled.current !== enabled) {
      lastLocationEnabled.current = enabled;
      setLocationEnabled(enabled);
      setModalClose(enabled);

      if (!enabled) {
        // Show modal when location is OFF
        setAlertConfig({
          title: 'Location Disabled',
          message:
            'Please enable location access to continue using the app.',
          type: 'error',
        });
        setModalClose(false)
        setAlertVisible(true);
      } else {
        // Hide modal when location is ON
        setAlertVisible(false);
      }

      console.log(enabled ? '📍 Location ON' : '📍 Location OFF');
    }
  }, 1000); // check every 1 second

  return () => clearInterval(interval);
}, []);



  // ------------------------- Device & Auth Setup -------------------------
  useEffect(() => {
    const fetchDeviceName = async () => {
      const name = await DeviceInfo.getDeviceName();
      let appid = await AsyncStorage.getItem('appid');
      if (!appid) {
        appid = app_id;
        await AsyncStorage.setItem('appid', appid || '');
      }
      await AsyncStorage.setItem('device', name);

      DevERPService.initialize();
      DevERPService.setAppId(appid || "");
      DevERPService.setDevice(name);

      dispatch(checkAuthStateThunk());
    };
    fetchDeviceName();
  }, [dispatch]);

  // ------------------------- Check & Start Location Sync -------------------------
  const startLocationSync = async () => {
    console.log("🚀 ~ startLocationSync ~ isAuthenticated:", isAuthenticated)
    // if (!isAuthenticated) return;

    const enabled = await DeviceInfo.isLocationEnabled();
    console.log("🚀 ~ startLocationSync ~ enabled:", enabled)
    if (!enabled) return;

    const hasPermission = await requestLocationPermission();
    console.log("🚀 ~ startLocationSync ~ hasPermission:", hasPermission)
    const fullPermission = await requestLocationPermissions();
    console.log("🚀 ~ startLocationSync ~ fullPermission:", fullPermission)
    if (!hasPermission || !fullPermission) return;

    // Clear any existing interval
    console.log("🚀 ~ startLocationSync ~ locationSyncInterval:", locationSyncInterval)
    if (locationSyncInterval.current) clearInterval(locationSyncInterval.current);

    locationSyncInterval.current = setInterval(() => {
      console.log('📌 Running location sync...');
      checkLocation();
    }, 1800);
  };

  // ------------------------- Initial Location Sync -------------------------
  useEffect(() => {
      startLocationSync();

    return () => {
      if (locationSyncInterval.current) clearInterval(locationSyncInterval.current);
    };
  }, [isAuthenticated, accounts]);

  // ------------------------- Check Location & Permissions -------------------------
  const checkLocation = async () => {
    try {

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

      if (isAuthenticated && enabled) {
        if (accounts.length > 0 && Platform.OS === 'android') {
          const granted = await requestLocationPermissions();
          console.log("🚀 ~ checkLocation ~ +++++++++++++++++++++++++++++++:", granted)
          if (granted) {
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
    } catch (err) {
      console.log('Location fetch error:', err);
    }
  };

  // ------------------------- AppState & Screen Focus -------------------------
  useFocusEffect(
    useCallback(() => {
      // if(!isAuthenticated){
      //   return;
      // }
      const checkPermissionsOnFocus = async () => {
        if (isCheckingPermission.current) return;
        isCheckingPermission.current = true;

        const hasPermission = await requestLocationPermission();
        const fullPermission = await requestLocationPermissions();

        if (hasPermission && fullPermission) {
          console.log('✅ Permissions granted after returning from Settings');
          setAlertVisible(false);
          setIsSettingVisible(false);
          setModalClose(true);

          // Start location sync
            startLocationSync();
        } else {
          setAlertConfig({
            title: 'Location Status',
            message: 'Please enable location access from Settings to continue.',
            type: 'error',
          });
          setAlertVisible(true);
          setIsSettingVisible(true);
        }

        isCheckingPermission.current = false;
      };

      const subscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active') {
          checkPermissionsOnFocus();
        }
      });

      // Initial check on focus
      if(isAuthenticated){
        checkPermissionsOnFocus();
      }

      return () => subscription.remove();
    }, [isAuthenticated])
  );

  // ------------------------- Render -------------------------
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