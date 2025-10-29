/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  PermissionsAndroid,
  NativeModules,
  AppState,
  Linking,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useAppDispatch } from '../../../store/hooks';
import { getERPPageThunk } from '../../../store/slices/auth/thunk';
import { savePageThunk } from '../../../store/slices/page/thunk';
import FullViewLoader from '../../../components/loader/FullViewLoader';
import NoData from '../../../components/no_data/NoData';
import ErrorMessage from '../../../components/error/Error';
import ERPIcon from '../../../components/icon/ERPIcon';
import ErrorModal from './components/ErrorModal';
import CustomPicker from './components/CustomPicker';
import Media from './components/Media';
import Disabled from './components/Disabled';
import Input from './components/Input';
import CustomAlert from '../../../components/alert/CustomAlert';
import AjaxPicker from './components/AjaxPicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { parseCustomDatePage, requestCameraPermission } from '../../../utils/helpers';
import DateRow from './components/Date';
import BoolInput from './components/BoolInput';
import SignaturePad from './components/SignaturePad';
import HtmlRow from './components/HtmlRow';
import { useBaseLink } from '../../../hooks/useBaseLink';
import DateTimeRow from './components/DateTimeRow';
import LocationRow from './components/LocationRow';
import FilePickerRow from './components/FilePicker';
import CustomMultiPicker from './components/CustomMultiPicker';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import BusinessCardView from './components/BusinessCardImage';
import DeviceInfo from 'react-native-device-info';

type PageRouteParams = { PageScreen: { item: any } };

export async function requestLocationPermissions(): Promise<
  'granted' | 'foreground-only' | 'denied' | 'blocked'
> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      const fine = granted['android.permission.ACCESS_FINE_LOCATION'];
      const coarse = granted['android.permission.ACCESS_COARSE_LOCATION'];
      const background = granted['android.permission.ACCESS_BACKGROUND_LOCATION'];

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return 'granted';
      }

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        return 'foreground-only';
      }

      if (
        fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        background === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return 'blocked';
      }

      return 'denied';
    } catch (err) {
      console.warn('requestLocationPermissions error:', err);
      return 'denied';
    }
  }
  return 'granted';
}

const PageScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);
  const baseLink = useBaseLink();

  const [loadingPageId, setLoadingPageId] = useState<string | null>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  console.log('🚀 ~ PageScreen------------- ~ formValues:', formValues);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState<string | null>(null);
  const [activeDateTime, setActiveDateTime] = useState<string | null>(null);

  const [activeDateField, setActiveDateField] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [loader, setLoader] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [actionSaveLoader, setActionSaveLoader] = useState(false);

  const [infoData, setInfoData] = useState<any>({});

  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [modalClose, setModalClose] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [backgroundDeniedModal, setBackgroundDeniedModal] = useState(false);

  const isCheckingPermission = useRef(false);
  const locationSyncInterval = useRef<NodeJS.Timeout | null>(null);
  const lastLocationEnabled = useRef<boolean | null>(null);
  const appState = useRef(AppState.currentState);

  const hasLocationField = controls.some(
    item => item?.defaultvalue && item?.defaultvalue === '#location',
  );

   const hasMediaField = controls.some(
    item =>  item?.ctltype === 'IMAGE' ||
        item?.ctltype === 'PHOTO',
  );

  console.log('locationEnabled ---------------- ', locationEnabled);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkLocation = async () => {
      const enabled = hasLocationField && await DeviceInfo.isLocationEnabled();
      console.log('locationEnabled -----enabled----------- ', enabled);

      setLocationEnabled(enabled);
    };

    // Run immediately once
    checkLocation();

    // Then run every 1 second
    interval = setInterval(checkLocation, 1000);

    // Cleanup interval on unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []); 
  // console.log(' ------------------------ ', hasLocationField);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //       console.log(
  //         'App**************************************************************** has come to the foreground!',
  //       );
  //       // Put your code here to check permissions, refresh data, etc.
  //       checkLocation();
  //     }
  //     appState.current = nextAppState;
  //   });

  //   return () => subscription.remove();
  // }, []);

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

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
    return true;
  };

  const startLocationSync = async () => {
    const enabled = await DeviceInfo.isLocationEnabled();
    if (!enabled) return;

    const hasPermission = await requestLocationPermission();
    const fullPermission = await requestLocationPermissions();

    if (fullPermission === 'foreground-only') {
      setBackgroundDeniedModal(true);
      return;
    }

    if (!hasPermission || fullPermission === 'denied' || fullPermission === 'blocked') return;

    if (locationSyncInterval.current) clearInterval(locationSyncInterval.current);

    checkLocation();
  };

  const checkLocation = async () => {
    try {
      const enabled = await DeviceInfo.isLocationEnabled();

      if (enabled !== locationEnabled) {
        setAlertConfig({
          title: 'Location Status',
          message: enabled
            ? 'Location is now enabled'
            : 'We need location access only to serve you better. Please enable it to continue.',
          type: enabled ? 'success' : 'error',
        });
        setAlertVisible(!enabled);
        setModalClose(false);
        setLocationEnabled(enabled);
      }

      if (hasLocationField && enabled) {
        if (Platform.OS === 'android') {
          const granted = await requestLocationPermissions();
          if (granted === 'granted') {
            // location access
            setLocationVisible(true);
          } else if (granted === 'foreground-only') {
            setBackgroundDeniedModal(true);
            setLocationVisible(true);
          }
        }
      }
    } catch (err) {
      setLocationVisible(false);

      console.log('Location fetch error:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkPermissionsOnFocus = async () => {
        if (isCheckingPermission.current) return;
        isCheckingPermission.current = true;

        const hasPermission = await requestLocationPermission();
        const fullPermission = await requestLocationPermissions();

        if (hasPermission && fullPermission === 'granted') {
          setAlertVisible(false);
          setIsSettingVisible(false);
          setModalClose(true);
          startLocationSync();
        } else if (hasPermission && fullPermission === 'foreground-only') {
          setBackgroundDeniedModal(true);
        } else {
          setAlertConfig({
            title: 'Location Status',
            message:
              'We need location access only to serve you better. Please enable it to continue.',
            type: 'error',
          });
          setModalClose(false);

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

      if (hasLocationField) {
        checkPermissionsOnFocus();
      }

      return () => subscription.remove();
    }, []),
  );

  const route = useRoute<RouteProp<PageRouteParams, 'PageScreen'>>();
  const { item, title, id, isFromNew, url, pageTitle }: any = route?.params;
  const authUser = item?.authuser;
  const isFromBusinessCard = route?.params?.isFromBusinessCard || false;

  const validateForm = useCallback(() => {
    const validationErrors: Record<string, string> = {};
    const errorMessages: string[] = [];

    controls.forEach(ctrl => {
      if (ctrl?.mandatory === '1' && !formValues[ctrl?.field]) {
        validationErrors[ctrl.field] = `${ctrl?.fieldtitle || ctrl?.field} is required`;
        errorMessages.push(`${ctrl?.fieldtitle || ctrl?.field} is required`);
      }
    });

    setErrors(validationErrors);
    setErrorsList(errorMessages);
    if (errorMessages?.length > 0) setShowErrorModal(true);

    return errorMessages?.length === 0;
  }, [controls, formValues]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: 210 }}>
          <Text
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontSize: 18,
              fontWeight: '700',
              color: ERP_COLOR_CODE.ERP_WHITE,
            }}
          >
            {title || pageTitle || 'Details'}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: ERP_COLOR_CODE.ERP_WHITE,
              marginLeft: 4,
            }}
          >
            {isFromNew ? '( New )' : '( Edit )'}
          </Text>
        </View>
      ),
      headerRight: () => (
        <>
          {!isFromNew && (
            <ERPIcon
              name="refresh"
              isLoading={actionLoader}
              onPress={() => {
                setActionLoader(true);
                fetchPageData();
                setErrors({});
                setErrorsList([]);
              }}
            />
          )}
          {!authUser && controls.length > 0 && (
            <ERPIcon
              name="save-as"
              isLoading={actionSaveLoader}
              onPress={async () => {
                try {
                  const enabled = await DeviceInfo.isLocationEnabled();
                  const permissionStatus = hasLocationField && await requestLocationPermissions();
                  const hasPermission = hasMediaField && await requestCameraPermission();
                   if (!hasPermission && hasMediaField) {
                    setAlertConfig({
                      title: 'Camera Status',
                      message:
                        'We need camera access only to serve you better. Please enable it to continue.',
                      type: 'error',
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }
                  console.log('permissionStatus', permissionStatus);
                  if (hasLocationField && !enabled) {
                    setAlertConfig({
                      title: 'Location Status',
                      message:
                        'We need location access only to serve you better. Please enable it to continue.',
                      type: 'error',
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }
                  if (hasLocationField && permissionStatus === 'denied' || permissionStatus === 'blocked') {
                    setAlertConfig({
                      title: 'Location Status',
                      message:
                        'We need location access only to serve you better. Please enable it to continue.',
                      type: 'error',
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }
                  if (permissionStatus.toString() !== 'blocked') {
                    setLocationVisible(true);
                    setActionSaveLoader(true);
                    setIsValidate(true);
                    if (validateForm()) {
                      const submitValues: Record<string, any> = {};
                      controls?.forEach(f => {
                        if (f.refcol !== '1') submitValues[f?.field] = formValues[f?.field];
                      });
                      try {
                        setLoader(true);
                        await dispatch(
                          savePageThunk({ page: url, id, data: { ...submitValues } }),
                        ).unwrap();
                        setLoader(false);
                        setIsValidate(false);

                        fetchPageData();
                        setAlertConfig({
                          title: 'Record saved',
                          message: `Record saved successfully!`,
                          type: 'success',
                        });
                        setAlertVisible(true);
                        setGoBack(true);
                        setTimeout(() => {
                          setAlertVisible(false);
                          navigation.goBack();
                        }, 1500);
                      } catch (err: any) {
                        setLoader(false);

                        setAlertConfig({
                          title: 'Record saved',
                          message: err,
                          type: 'error',
                        });
                        setAlertVisible(true);
                        setGoBack(false);
                      }
                    }
                    setActionSaveLoader(false);
                  }
                } catch (error) {
                  console.error('Error checking location status:', error);
                }
              }}
            />
          )}
        </>
      ),
    });
  }, [
    navigation,
    item?.name,
    id,
    controls,
    formValues,
    validateForm,
    goBack,
    alertVisible,
    loader,
    actionLoader,
    actionSaveLoader,
  ]);

  const fetchPageData = useCallback(async () => {
    try {
      setError(null);
      setLoadingPageId(isFromNew ? '0' : id);

      const parsed = await dispatch(
        getERPPageThunk({ page: url, id: isFromNew ? 0 : id }),
      ).unwrap();
      console.log('🚀 ~ parsed:', parsed);

      if (!isFromNew) {
        setInfoData({
          id: id?.toString(),
          tableName: parsed?.table,
          title: parsed?.title,
        });
      }

      const pageControls = Array.isArray(parsed?.pagectl) ? parsed?.pagectl : [];
      console.log('🚀 ~ pageControls:', pageControls);

      const normalizedControls = pageControls?.map(c => ({
        ...c,
        disabled: String(c?.disabled ?? '0'),
        visible: String(c?.visible ?? '1'),
        mandatory: String(c?.mandatory ?? '0'),
      }));

      setControls(normalizedControls);

      setFormValues(prev => {
        const merged: any = { ...prev };
        normalizedControls.forEach(c => {
          if (merged[c?.field] === undefined) {
            merged[c?.field] = c?.text ?? '';
          }
        });
        return merged;
      });
    } catch (e: any) {
      console.log('🚀 ~ e:', e);
      setError(JSON.stringify(e?.data) || 'Failed to load page');
    } finally {
      setLoadingPageId(null);
      setTimeout(() => {
        setActionLoader(false);
      }, 10);
    }
  }, [dispatch, id, url]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleAttachment = (base64: string, val: any) => {
    setFormValues(prev => {
      return { ...prev, [val]: base64 };
    });
  };

  const handleSignatureAttachment = (base64: string, val: any) => {
    setFormValues(prev => {
      return { ...prev, [val]: base64 };
    });
  };

  const showDateTimePicker = (field: string, date: any) => {
    setActiveDateTimeField(field);
    setActiveDateTime(date);
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
    setActiveDateTimeField(null);
  };

  const handleDateTimeConfirm = (date: Date) => {
    if (activeDateTimeField) {
      setFormValues(prev => ({ ...prev, [activeDateTimeField]: date.toISOString() }));
    }
    hideDateTimePicker();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      console.log('🚀 ~ item:----------------', item);
      const setValue = (val: any) => {
        if (typeof val === 'object' && val !== null) {
          setFormValues(prev => ({ ...prev, ...val }));
        } else {
          setFormValues(prev => ({ ...prev, [item?.field]: val }));
        }
        setErrors(prev => ({ ...prev, [item?.field]: '' }));
      };

      const value = formValues[item?.field] || formValues[item?.text] || '';

      if (item?.visible === '1') return null;

      let content = null;
      if (item?.ctltype === 'BOOL') {
        const rawVal = formValues[item?.field] ?? item?.text;
        const boolVal = String(rawVal).toLowerCase() === 'true';
        content = (
          <BoolInput
            label={item?.fieldtitle}
            value={boolVal}
            onChange={val => setValue({ [item?.field]: val })}
          />
        );
      } else if (item?.field === 'chemistname') {
        content = (
          <CustomMultiPicker
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ''}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      } else if (item?.ctltype === 'FILE') {
        content = (
          <FilePickerRow
            isValidate={isValidate}
            baseLink={baseLink}
            infoData={infoData}
            item={item}
            handleAttachment={handleAttachment}
          />
        );
      } else if (item?.defaultvalue === '#location') {
        content = (
          <LocationRow
            locationVisible={locationVisible}
            isValidate={isValidate}
            locationEnabled={locationEnabled}
            item={item}
            setValue={setValue}
          />
        );
      } else if (item?.defaultvalue === '#html') {
        content = (
          <View>
            {' '}
            <HtmlRow item={item} isFromPage={true} />
          </View>
        );
      } else if (item?.ctltype === 'IMAGE' && item?.field === 'signature') {
        content = (
          <SignaturePad
            isValidate={isValidate}
            infoData={infoData}
            item={item}
            handleSignatureAttachment={handleSignatureAttachment}
          />
        );
      } else if (
        item?.ctltype === 'FILE' ||
        item?.ctltype === 'IMAGE' ||
        item?.ctltype === 'PHOTO'
      ) {
        content = (
          <>
            {isFromBusinessCard ? (
              <BusinessCardView
                baseLink={baseLink}
                infoData={infoData}
                setValue={setValue}
                controls={controls}
                item={item}
              />
            ) : (
              <Media
                isValidate={isValidate}
                baseLink={baseLink}
                infoData={infoData}
                item={item}
                isFromNew={isFromNew}
                handleAttachment={handleAttachment}
              />
            )}
          </>
        );
      } else if (item?.disabled === '1' && item?.ajax !== 1) {
        content = <Disabled item={item} value={value} type={item?.ctltype} />;
      } else if (item?.ddl && item?.ddl !== '' && item?.ajax === 0) {
        content = (
          <CustomPicker
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ''}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      } else if (item?.ddl && item?.ddl !== '' && item?.ajax === 1) {
        content = (
          <AjaxPicker
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ''}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
            formValues={formValues}
          />
        );
      } else if (item?.ctltype === 'DATE') {
        content = (
          <DateRow
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDatePicker={showDatePicker}
          />
        );
      } else if (item?.ctltype === 'DATETIME') {
        content = (
          <DateTimeRow
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDateTimePicker={showDateTimePicker}
          />
        );
      } else {
        content = (
          <Input
            isValidate={isValidate}
            onFocus={() => flatListRef.current?.scrollToIndex({ index, animated: true })}
            item={item}
            errors={errors}
            value={value}
            setValue={setValue}
          />
        );
      }

      return (
        <Animated.View
          entering={FadeInUp.delay(index * 70).springify()}
          layout={Layout.springify()}
        >
          {content}
        </Animated.View>
      );
    },
    [formValues, errors, controls, locationEnabled],
  );

  const showDatePicker = (field: string, date: any) => {
    setActiveDateField(field);
    setActiveDate(date);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setActiveDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (activeDateField) {
      setFormValues(prev => ({ ...prev, [activeDateField]: date.toISOString() }));
    }
    hideDatePicker();
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}>
      {loadingPageId ? (
        <FullViewLoader />
      ) : !!error ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
          }}
        >
          <ErrorMessage message={error} />
        </View>
      ) : controls?.length > 0 ? (
        <>
          <View
            style={{
              flex: 1,
              height: Dimensions.get('screen').height,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={controls}
              ref={flatListRef}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: keyboardHeight }}
              keyboardShouldPersistTaps="handled"
            />
          </View>
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
          {loader && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999,
              }}
            >
              <FullViewLoader />
            </View>
          )}
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <NoData />
        </View>
      )}

      <ErrorModal
        visible={showErrorModal}
        errors={errorsList}
        onClose={() => setShowErrorModal(false)}
      />
      <DateTimePicker
        isVisible={dateTimePickerVisible}
        mode="datetime"
        date={activeDateTime ? parseCustomDatePage(activeDateTime) : new Date()}
        onConfirm={handleDateTimeConfirm}
        onCancel={hideDateTimePicker}
      />
      <DateTimePicker
        isVisible={datePickerVisible}
        mode="date"
        date={activeDate ? parseCustomDatePage(activeDate) : new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => {
          setAlertVisible(false);
          if (goBack) {
            navigation.goBack();
          }
        }}
        actionLoader={undefined}
      />
    </View>
  );
};

export default PageScreen;
