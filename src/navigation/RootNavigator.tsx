import React, { useEffect, 
  // useState, useRef, useCallback 
} from 'react';
// import {
//   PermissionsAndroid,
//   Platform,
//   NativeModules,
//   AppState,
//   Linking,
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStateThunk } from '../store/slices/auth/thunk';
import DevERPService from '../services/api/deverp';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import FullViewLoader from '../components/loader/FullViewLoader';
import DeviceInfo from 'react-native-device-info';
// import CustomAlert from '../components/alert/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
import { setERPTheme, 
  // ERP_COLOR_CODE
 } from '../utils/constants';

// ------------------------- Location Permission Helper -------------------------
// export async function requestLocationPermissions(): Promise<
//   'granted' | 'foreground-only' | 'denied' | 'blocked'
// > {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//       ]);

//       const fine = granted['android.permission.ACCESS_FINE_LOCATION'];
//       const coarse = granted['android.permission.ACCESS_COARSE_LOCATION'];
//       const background = granted['android.permission.ACCESS_BACKGROUND_LOCATION'];

//       if (
//         fine === PermissionsAndroid.RESULTS.GRANTED &&
//         coarse === PermissionsAndroid.RESULTS.GRANTED &&
//         background === PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         return 'granted';
//       }

//       if (
//         fine === PermissionsAndroid.RESULTS.GRANTED &&
//         coarse === PermissionsAndroid.RESULTS.GRANTED &&
//         background !== PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         return 'foreground-only';
//       }

//       if (
//         fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
//         coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
//         background === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
//       ) {
//         return 'blocked';
//       }

//       return 'denied';
//     } catch (err) {
//       console.warn('requestLocationPermissions error:', err);
//       return 'denied';
//     }
//   }
//   return 'granted';
// }

// ------------------------- RootNavigator Component -------------------------
const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, accounts, user } = useAppSelector(state => state.auth);
  const theme = useAppSelector(state => state.theme);

  // const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  // const [alertVisible, setAlertVisible] = useState(false);
  // const [modalClose, setModalClose] = useState(false);
  // const [isSettingVisible, setIsSettingVisible] = useState(false);
  // const [backgroundDeniedModal, setBackgroundDeniedModal] = useState(false);
  // const [alertConfig, setAlertConfig] = useState({
  //   title: '',
  //   message: '',
  //   type: 'info' as 'error' | 'success' | 'info',
  // });

  // const isCheckingPermission = useRef(false);
  // const locationSyncInterval = useRef<NodeJS.Timeout | null>(null);
  // const lastLocationEnabled = useRef<boolean | null>(null);
  const app_id = user?.app_id;
  // const appState = useRef(AppState.currentState);

  // ------------------------- Theme -------------------------
  useEffect(() => {
    setERPTheme('light');
  }, [theme]);

  //  useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //       console.log('App**************************************************************** has come to the foreground!');
  //       // Put your code here to check permissions, refresh data, etc.
  //       checkLocation()
  //     }
  //     appState.current = nextAppState;
  //   });

  //   return () => subscription.remove();
  // }, []);

  // ------------------------- Detect Location Enabled & Permission -------------------------
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const enabled = await DeviceInfo.isLocationEnabled();
  //     const permissionStatus = await requestLocationPermissions();

  //     // Show alert only if status changed
  //     if (enabled !== lastLocationEnabled.current) {
  //       if (!enabled) {
  //         setAlertConfig({
  //           title: 'Location Status',
  //           message:
  //             'We need location access only to serve you better. Please enable it to continue.',
  //           type: 'error',
  //         });
  //         setAlertVisible(true);
  //         setModalClose(false);
  //       } else {
  //         setAlertVisible(false);
  //         setModalClose(true);
  //       }
  //       lastLocationEnabled.current = enabled;
  //     }

  //     // Show background permission modal only once when required
  //     if (permissionStatus === 'foreground-only' && !backgroundDeniedModal) {
  //       setBackgroundDeniedModal(true);
  //     } else if (permissionStatus !== 'foreground-only' && backgroundDeniedModal) {
  //       setBackgroundDeniedModal(false);
  //     }

  //     setLocationEnabled(enabled);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [backgroundDeniedModal]);

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
      DevERPService.setAppId(appid || '');
      DevERPService.setDevice(name);

      dispatch(checkAuthStateThunk());
    };
    fetchDeviceName();
  }, [dispatch]);

  // ------------------------- Request Foreground Permissions -------------------------
  // const requestLocationPermission = async (): Promise<boolean> => {
  //   if (Platform.OS === 'android') {
  //     return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  //   }
  //   return true;
  // };

  // ------------------------- Start Location Sync -------------------------
  // const startLocationSync = async () => {
  //   const enabled = await DeviceInfo.isLocationEnabled();
  //   if (!enabled) return;

  //   const hasPermission = await requestLocationPermission();
  //   const fullPermission = await requestLocationPermissions();

  //   if (fullPermission === 'foreground-only') {
  //     setBackgroundDeniedModal(true);
  //     return;
  //   }

  //   if (!hasPermission || fullPermission === 'denied' || fullPermission === 'blocked') return;

  //   if (locationSyncInterval.current) clearInterval(locationSyncInterval.current);

  //   locationSyncInterval.current = setInterval(() => {
  //     checkLocation();
  //   }, 1800);
  // };

  // ------------------------- Check Location -------------------------
  // const checkLocation = async () => {
  //   try {
  //     const enabled = await DeviceInfo.isLocationEnabled();

  //     if (enabled !== locationEnabled) {
  //       setAlertConfig({
  //         title: 'Location Status',
  //         message: enabled
  //           ? 'Location is now enabled'
  //           : 'We need location access only to serve you better. Please enable it to continue.',
  //         type: enabled ? 'success' : 'error',
  //       });
  //       setAlertVisible(!enabled);
  //       setModalClose(false);
  //       setLocationEnabled(enabled);
  //     }

  //     if (isAuthenticated && enabled) {
  //       if (accounts.length > 0 && Platform.OS === 'android') {
  //         const granted = await requestLocationPermissions();
  //         if (granted === 'granted') {
  //           const data = accounts.map(u => ({
  //             token: u?.user?.token,
  //             link: u?.user?.companyLink.replace(/^https:\/\//i, 'http://'),
  //           }));
  //           NativeModules.LocationModule.setUserTokens(data);
  //           NativeModules.LocationModule?.startService();
  //         } else if (granted === 'foreground-only') {
  //           setBackgroundDeniedModal(true);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.log('Location fetch error:', err);
  //   }
  // };

  // ------------------------- Focus / AppState -------------------------
  // useFocusEffect(
  //   useCallback(() => {
  //     const checkPermissionsOnFocus = async () => {
  //       if (isCheckingPermission.current) return;
  //       isCheckingPermission.current = true;

  //       const hasPermission = await requestLocationPermission();
  //       const fullPermission = await requestLocationPermissions();

  //       if (hasPermission && fullPermission === 'granted') {
  //         setAlertVisible(false);
  //         setIsSettingVisible(false);
  //         setModalClose(true);
  //         startLocationSync();
  //       } else if (hasPermission && fullPermission === 'foreground-only') {
  //         setBackgroundDeniedModal(true);
  //       } else {
  //         setAlertConfig({
  //           title: 'Location Status',
  //           message:
  //             'We need location access only to serve you better. Please enable it to continue.',
  //           type: 'error',
  //         });
  //                   setModalClose(false);

  //         setAlertVisible(true);
  //         setIsSettingVisible(true);
  //       }

  //       isCheckingPermission.current = false;
  //     };

  //     const subscription = AppState.addEventListener('change', nextAppState => {
  //       if (nextAppState === 'active') {
  //         checkPermissionsOnFocus();
  //       }
  //     });

  //     if (isAuthenticated) {
  //       checkPermissionsOnFocus();
  //     }

  //     return () => subscription.remove();
  //   }, [isAuthenticated]),
  // );

  // ------------------------- Render -------------------------
  if (isLoading) return <FullViewLoader />;

  return (
    <>
      {isAuthenticated ? <StackNavigator /> : <AuthNavigator />}

      {/* General Alert */}
      {/* <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => {
          if (modalClose) setAlertVisible(false);
        }}
        actionLoader={undefined}
        isSettingVisible={isSettingVisible}
      /> */}

      {/* Foreground-only Background Permission Modal */}
      {/* <Modal visible={backgroundDeniedModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Allow Background Location</Text>
            <Text style={styles.message}>
              For continuous location tracking, set location access to{' '}
              <Text style={{ fontWeight: '600' }}>"Allow all the time"</Text> in your phone
              settings.
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => {
                  Linking.openSettings();
                  setBackgroundDeniedModal(false);
                }}
              >
                <Text style={styles.btnText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </>
  );
};

export default RootNavigator;

// ------------------------- Styles -------------------------
// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: '85%',
//     padding: 20,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   btnRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   btn: {
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//   },
//   btnPrimary: {
//     backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
//   },
//   btnSecondary: {
//     borderWidth: 1,
//     borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
//   },
//   btnText: {
//     fontWeight: '600',
//     color: '#fff',
//   },
// });
