import { View, Text, Image, TextInput, AppState, Platform, Linking } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';

import { AttendanceFormValues, UserLocation } from '../types';
import { requestCameraAndLocationPermission } from '../../../../utils/helpers';
import useTranslations from '../../../../hooks/useTranslations';
import { styles } from '../attendance_style';
import CustomAlert from '../../../../components/alert/CustomAlert';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { markAttendanceThunk } from '../../../../store/slices/attendance/thunk';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import SlideButton from './SlideButton';
import FastImage from 'react-native-fast-image';
import { useBaseLink } from '../../../../hooks/useBaseLink';
import ProfileImage from '../../../../components/profile/ProfileImage';

const AttendanceForm = ({ setBlockAction, resData }: any) => {
  const { t } = useTranslations();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state?.auth);
  const baseLink = useBaseLink();

  const [statusImage, setStatusImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [attendanceDone, setAttendanceDone] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const [blocked, setBlocked] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  // -------------------- Pending Camera Action --------------------
  const pendingCameraAction = useRef<{
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void;
    handleSubmit: () => void;
  } | null>(null);

  // -------------------- AppState Listener --------------------
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (nextAppState === 'active' && pendingCameraAction.current) {
        const hasPermission = await requestCameraAndLocationPermission();
        if (hasPermission) {
          setIsSettingVisible(false);
          setAlertVisible(false);
          const { setFieldValue, handleSubmit } = pendingCameraAction.current;
          pendingCameraAction.current = null;
          openCamera(setFieldValue, handleSubmit);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  const openCamera = (
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void,
    handleSubmit: () => void,
  ) => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.7,
        includeBase64: true,
      },
      response => {
        if (response?.didCancel || response?.errorCode) {
          setLocationLoading(false);
          setBlockAction(false);
          return;
        }

        const photoUri = response?.assets?.[0]?.uri;
        const asset = response?.assets?.[0];
        if (!photoUri) return;
        if (asset?.base64) {
          setFieldValue(
            'imageBase64',
            `${
              resData?.success === 1 || resData?.success === '1' ? 'punchOut.jpeg' : 'punchIn.jpeg'
            }; data:${asset?.type};base64,${asset?.base64}`,
          );
        }
        setStatusImage(photoUri);

        setTimeout(() => {
          handleSubmit();
        }, 1000);
      },
    );
  };

  const handleStatusToggle = async (
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void,
    handleSubmit: () => void,
  ) => {
    setBlockAction(true);
    if (locationLoading) return;

    const hasPermission = await requestCameraAndLocationPermission();
    if (!hasPermission) {
      // Save pending action so we can resume after user grants permission
      pendingCameraAction.current = { setFieldValue, handleSubmit };

      setAlertConfig({
        title: t('errors.permissionRequired'),
        message: t('errors.cameraLocationPermission'),
        type: 'error',
      });
      setModalClose(true);
      setAlertVisible(true);
      setIsSettingVisible(true);

      setBlockAction(false);
      return;
    }

    setBlocked(false);
    setLocationLoading(true);

    const getLocationWithRetry = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position?.coords;
          setUserLocation({ latitude, longitude });
          setFieldValue('latitude', String(latitude));
          setFieldValue('longitude', String(longitude));
          openCamera(setFieldValue, handleSubmit);
        },
        error => {
          setAlertConfig({
            title: t('errors.locationError'),
            message: error?.message || 'Unable to fetch location',
            type: 'error',
          });
          setAlertVisible(true);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    getLocationWithRetry();
  };

  return (
    <View style={{ width: '100%', padding: 16 }}>
      <Formik
        initialValues={{
          name: user?.name,
          latitude: userLocation ? String(userLocation?.latitude) : '',
          longitude: userLocation ? String(userLocation?.longitude) : '',
          remark: '',
          dateTime: new Date().toISOString(),
          imageBase64: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(t('attendance.nameRequired')),
          longitude: Yup.string().optional(),
          remark: Yup.string().optional(),
          dateTime: Yup.string().optional(),
          imageBase64: Yup.string().required('Image required'),
        })}
        onSubmit={values => {
          dispatch(
            markAttendanceThunk({
              rawData: values,
              type: resData?.success === 1 || resData?.success === '1' ? false : true,
              user,
              id: resData?.success === 1 || resData?.success === '1' ? resData?.id : '0',
            }),
          )
            .unwrap()
            .then(res => {
              setAttendanceDone(true);
              setAlertConfig({
                title: 'Success',
                message: 'Attendance marked successfully!',
                type: 'success',
              });
              setAlertVisible(true);
              setLocationLoading(false);
              setBlockAction(false);

              setTimeout(() => {
                navigation?.goBack();
                setAlertVisible(false);
              }, 1000);
            })
            .catch(err => {
              setAttendanceDone(false);
              setAlertConfig({
                title: 'Error',
                message: err || 'Something went wrong',
                type: 'error',
              });
              setAlertVisible(true);
              setLocationLoading(false);
              setBlockAction(false);
            });
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.imageCol}>
                {`${baseLink}/FileUpload/1/UserMaster/${user?.id}/profileimage.jpeg` ? (
                 <ProfileImage userId={user?.id} baseLink={baseLink} />
                ) : (
                  <View
                    style={[
                      styles.profileAvatar,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                      },
                    ]}
                  >
                    <Text style={{ color: ERP_COLOR_CODE.ERP_WHITE, fontWeight: 'bold', fontSize: 26 }}>
                      {user?.name ? user?.name.substring(0, 2).toUpperCase() : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{}}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('attendance.employeeName')}</Text>
                <TextInput
                  style={[styles.input, styles.inputReadonly]}
                  value={values?.name}
                  editable={false}
                />
                {touched?.name && errors?.name ? (
                  <Text style={styles.errorText}>{errors?.name}</Text>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('attendance.remark')}</Text>
                <TextInput
                  style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
                  value={values?.remark}
                  onChangeText={text => setFieldValue('remark', text)}
                  placeholder={t('attendance.enterRemark')}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {statusImage && (
                <View>
                  <Image source={{ uri: statusImage }} style={styles.selfyAvatar} />
                  <Text style={styles.imageLabel}>{t('attendance.capturedPhoto')}</Text>
                </View>
              )}

              <View>
                <SlideButton
                  label={
                    resData?.success === 1 || resData?.success === '1'
                      ? `Slide to ${t('attendance.checkOut')}`
                      : `Slide to ${t('attendance.checkIn')}`
                  }
                  successColor={
                    resData?.success === 1 || resData?.success === '1'
                      ? ERP_COLOR_CODE.ERP_ERROR
                      : ERP_COLOR_CODE.ERP_APP_COLOR
                  }
                  loading={locationLoading}
                  completed={attendanceDone}
                  blocked={blocked}
                  onSlideSuccess={() => handleStatusToggle(setFieldValue, handleSubmit)}
                />
              </View>
            </View>
          </View>
        )}
      </Formik>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig?.title}
        message={alertConfig?.message}
        type={alertConfig?.type}
        onClose={() => {
          if (!modalClose) {
            if (attendanceDone) {
              navigation?.goBack();
              setAlertVisible(false);
            } else {
              setBlocked(true);
              setAlertVisible(false);

              setTimeout(() => {
                setBlocked(false);
              }, 1000);
            }
          }
        }}
        actionLoader={undefined}
        isSettingVisible={isSettingVisible}
      />
    </View>
  );
};

export default AttendanceForm;
