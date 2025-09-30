import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './settings_style';
import CustomAlert from '../../../components/alert/CustomAlert';
import useTranslations from '../../../hooks/useTranslations';
import { useAppDispatch } from '../../../store/hooks';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {
  logoutUserThunk,
  removeAccountThunk,
  switchAccountThunk,
} from '../../../store/slices/auth/thunk';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import {
  createAccountsTable,
  getActiveAccount,
  getDBConnection,
  logoutUser,
} from '../../../utils/sqlite';
import { DevERPService } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApi } from '../../../hooks/useApi';

interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  action?: string;
}

interface LanguageOption {
  code: string;
  name: string;
}

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { t, changeLanguage, getAvailableLanguages, getCurrentLanguage } = useTranslations();
  const [alertVisible, setAlertVisible] = useState(false);

  const [logoutVisible, setLogoutVisible] = useState(false);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [languages] = useState<LanguageOption[]>(getAvailableLanguages());
  const { execute: validateCompanyCode } = useApi();

  const dispatch = useAppDispatch();

  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });
  const [settings, setSettings] = useState<SettingItem[]>([]);

  useEffect(() => {
    setSettings([
      {
        id: '1',
        title: t('settings.pushNotifications'),
        subtitle: t('settings.receiveAlerts'),
        icon: 'notifications-active',
        type: 'toggle',
        value: true,
      },
      {
        id: '2',
        title: t('settings.emailNotifications'),
        subtitle: t('settings.getEmailUpdates'),
        icon: 'mail',
        type: 'toggle',
        value: false,
      },
      {
        id: '3',
        title: t('settings.darkMode'),
        subtitle: t('settings.switchDarkTheme'),
        icon: 'dark-mode',
        type: 'toggle',
        value: false,
      },
      {
        id: '4',
        title: t('settings.biometricAuth'),
        subtitle: t('settings.useBiometric'),
        icon: 'password',
        type: 'navigate',
        value: true,
      },

      {
        id: '5',
        title: t('settings.privacySettings'),
        subtitle: t('settings.managePrivacy'),
        icon: 'security',
        type: 'navigate',
        action: 'Privacy',
      },

      {
        id: '6',
        title: t('settings.language'),
        subtitle: getCurrentLanguage(),
        icon: 'language',
        type: 'navigate',
        action: 'Language',
      },
      {
        id: '7',
        title: t('settings.aboutApp'),
        subtitle: `${t('common.version')} 1.0.0`,
        icon: 'info',
        type: 'navigate',
        action: 'About',
      },
      {
        id: '8',
        title: t('settings.helpSupport'),
        subtitle: t('settings.getHelp'),
        icon: 'help',
        type: 'navigate',
        action: 'Support',
      },
      {
        id: '9',
        title: t('settings.logout'),
        subtitle: t('settings.signOut'),
        icon: 'logout',
        type: 'action',
        action: 'Logout',
      },
    ]);
  }, [t, currentLanguage]);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings?.map(setting =>
        setting.id === id ? { ...setting, value: !setting.value } : setting,
      ),
    );
  };

  const handleAction = (item: SettingItem) => {
    switch (item?.type) {
      case 'navigate':
        if (item?.title === t('settings.aboutApp')) {
          return;
        }
        if (item?.action === 'Language') {
          setLanguageModalVisible(true);
        } else if (item?.title === t('settings.biometricAuth')) {
          navigation.navigate('PinSet');
        } else if (item?.title === t('settings.privacySettings')) {
          navigation.navigate('Privacy Policy');
        } else if (item?.title === t('settings.helpSupport')) {
          // navigation.navigate('');
        } else if (item?.action) {
          setAlertConfig({
            title: t('common.navigate'),
            message: `${t('common.navigate')} to ${item?.action} functionality would go here`,
            type: 'info',
          });
          setAlertVisible(true);
          setTimeout(() => {
            setAlertVisible(false);
          }, 1200);
        }
        break;
      case 'action':
        if (item?.action === 'Logout') {
          setLogoutVisible(true);
          setAlertConfig({
            title: t('settings.logout'),
            message: t('settings.logoutConfirm'),
            type: 'error',
          });
          setAlertVisible(true);
        } else if (item?.action) {
          setAlertConfig({
            title: t('common.action'),
            message: `${item?.action} functionality would go here`,
            type: 'info',
          });
          setAlertVisible(true);
        }
        break;
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setLanguageModalVisible(false);

    setAlertConfig({
      title: t('language.languageChanged'),
      message: t('language.languageChangedMessage'),
      type: 'success',
    });
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 1200);
  };

  const renderSettingItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity
      style={styles.settingCard}
      onPress={() => handleAction(item)}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingHeader}>
        <View style={styles.settingIcon}>
          <MaterialIcons name={item?.icon} color={ERP_COLOR_CODE.ERP_BLACK} size={22} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item?.title}</Text>
          <Text style={styles.settingSubtitle}>{item?.subtitle}</Text>
        </View>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={() => {
              handleToggle(item.id);
            }}
            trackColor={{ false: ERP_COLOR_CODE.ERP_e0e0e0, true: '#4CAF50' }}
            thumbColor={item.value ? ERP_COLOR_CODE.ERP_WHITE : '#f4f3f4'}
          />
        ) : (
          <>{item?.title !== t('settings.aboutApp') && <Text style={styles.arrowIcon}>›</Text>}</>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderLanguageOption = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        languageStyles.languageOption,
        currentLanguage === item.code && languageStyles.selectedLanguage,
      ]}
      onPress={() => handleLanguageChange(item.code)}
    >
      <Text
        style={[
          languageStyles.languageName,
          currentLanguage === item.code && languageStyles.selectedLanguageText,
        ]}
      >
        {item.name}
      </Text>
      {currentLanguage === item.code && <Text style={languageStyles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  const handleRemovedAccount = (accountId: string) => {
    dispatch(removeAccountThunk(accountId));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={settings.filter(item => item.id === '1' || item.id === '2')}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={settings.filter(item => item.id === '3')}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.security')}</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={settings.filter(item => item.id === '4' || item.id === '5')}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.general')}</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={settings.filter(item => item.id === '6' || item.id === '7' || item.id === '8')}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={settings.filter(item => item.id === '9')}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setLogoutVisible(false);
          setLanguageModalVisible(false);
        }}
      >
        <View style={languageStyles.modalOverlay}>
          <View style={languageStyles.modalContent}>
            <View style={languageStyles.modalHeader}>
              <Text style={languageStyles.modalTitle}>{t('language.selectLanguage')}</Text>
              <TouchableOpacity
                onPress={() => {
                  setLogoutVisible(false);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={languageStyles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              keyboardShouldPersistTaps="handled"
              renderItem={renderLanguageOption}
              keyExtractor={item => item.code}
              style={languageStyles.languageList}
            />
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => {
          setLogoutVisible(false);
          setAlertVisible(false);
        }}
        isBottomButtonVisible={logoutVisible}
        onCancel={() => {
          setLogoutVisible(false);
          setAlertVisible(false);
        }}
        onDone={async () => {
          if (logoutVisible) {
            const db = await getDBConnection();
            await createAccountsTable(db);

            const activeUser = await getActiveAccount(db);
            if (activeUser) {
              const newActiveUser = await logoutUser(db, activeUser?.id);

              if (newActiveUser) {
                DevERPService.setToken(newActiveUser?.user?.token || '');
                await AsyncStorage.setItem('erp_token', newActiveUser?.user?.token || '');
                await AsyncStorage.setItem('auth_token', newActiveUser?.user?.token || '');
                await AsyncStorage.setItem(
                  'erp_token_valid_till',
                  newActiveUser?.user?.token || '',
                );

                const validation = await validateCompanyCode(() =>
                  DevERPService.validateCompanyCode(newActiveUser?.user?.company_code),
                );
                if (!validation?.isValid) {
                  return;
                }

                dispatch(switchAccountThunk(newActiveUser?.id));
              } else {
                dispatch(logoutUserThunk());
              }
            }
          }
        }}
        doneText="Logout"
        color={ERP_COLOR_CODE.ERP_ERROR}
        actionLoader={undefined}
      />
    </View>
  );
};

const languageStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
  },
  languageList: {
    maxHeight: 300,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f5f5f5',
  },
  languageName: {
    fontSize: 16,
    color: ERP_COLOR_CODE.ERP_333,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkmark: {
    fontSize: 18,
    color: '#2196F3',
  },
});

export default SettingsScreen;
