import React, { useEffect, useState } from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUserThunk } from '../../../store/slices/auth/thunk';
import CustomAlert from '../../../components/alert/CustomAlert';
import useTranslations from '../../../hooks/useTranslations';
import { styles } from './login_style';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ERP_COLOR_CODE } from '../../../utils/constants';

const LoginScreen = ({ navigation, route }: any) => {
  const { t } = useTranslations();
  const dispatch = useAppDispatch();

  const isAddingAccount = route?.params?.isAddingAccount || false;
  const { isLoading } = useAppSelector(state => state.auth);

  const [deviceId, setDeviceId] = useState<string>('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const fetchDeviceName = async () => {
      const name = await DeviceInfo.getDeviceName();
      setDeviceId(name);
      AsyncStorage.setItem('device', name);
    };
    fetchDeviceName();

    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height + 10);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handlePersistAfterLogin = async (
    company_code: string,
    password: string,
    user_credentials: { user: string; name?: string },
    response: any,
    companyData: any,
  ) => {
    dispatch(
      loginUserThunk({
        company_code,
        password,
        isAddingAccount,
        user_credentials,
        response,
        companyData,
      }),
    );
  };

  const showAlert = (config: {
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={['']}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardHeight / 2 || 20,
          }}
          renderItem={() => (
            <>
              <View style={styles.formContainer}>
                <LoginHeader isAddingAccount={isAddingAccount} t={t} />
                <LoginForm
                  deviceId={deviceId}
                  isAddingAccount={isAddingAccount}
                  isLoading={isLoading}
                  onLoginSuccess={handlePersistAfterLogin}
                  showAlert={showAlert}
                />
                {isAddingAccount && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>{t('auth.cancel')}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertVisible(false)}
                actionLoader={undefined}
              />
            </>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
