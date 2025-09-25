import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import AccountSwitcher from './components/AccountSwitcher';
import { styles } from './profile_style';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../../store/hooks';
import { firstLetterUpperCase, formatDateHr } from '../../../../utils/helpers';
import AddAccountScreen from '../../add_account/AddAccountScreen';
import ERPIcon from '../../../../components/icon/ERPIcon';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FastImage from 'react-native-fast-image';
import { useBaseLink } from '../../../../hooks/useBaseLink';
import { useTranslation } from 'react-i18next';

const ProfileTab = () => {
  const {t} = useTranslation()
  const navigation = useNavigation<any>();
  const { user, accounts } = useAppSelector(state => state?.auth);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const baseLink = useBaseLink();

  const handleAddAccount = () => {
    setShowAccountSwitcher(false);
    setShowAddAccount(true);
  };

  const activeAccount = accounts?.find(acc => acc?.user?.id === user?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <ERPIcon
            name="add"
            onPress={() => {
              handleAddAccount();
            }}
          />
          <ERPIcon
            name="settings"
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
        </>
      ),
      headerLeft: () => (
        <>
          <ERPIcon extSize={24} isMenu={true} name="menu" onPress={() => navigation.openDrawer()} />
        </>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        {user && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Page', {
                id: user?.id,
                item: {},
                title: t('profile.myProfile'),
                isFromNew: false,
                url: 'UserProfile',
              });
            }}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <FastImage
                  source={{
                    uri: `${baseLink}/FileUpload/1/UserMaster/${
                      user?.id
                    }/profileimage.jpeg?ts=${new Date().getTime()}`,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.web,
                  }}
                  style={{ height: 56, width: 56, borderRadius: 46 }}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{firstLetterUpperCase(user?.name)}</Text>
                <Text style={styles.profileEmail}>{user?.companyName}</Text>
                <Text style={styles.accountType}>
                  {(user?.rolename)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => {
                  navigation.navigate('Page', {
                    id: user?.id,
                    item: {},
                  title: t('profile.myProfile'),
                    isFromNew: false,
                    url: 'UserProfile',
                  });
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name={'edit'} color={'#000'} size={20} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.accountManagement')}</Text>
          <TouchableOpacity style={styles.settingCard} onPress={() => setShowAccountSwitcher(true)}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <MaterialIcons name={'group'} color={'#000'} size={22} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('profile.manageAccounts')}</Text>
                <Text style={styles.settingSubtitle}>
                  {accounts?.length} {t('profile.account')}{accounts?.length !== 1 ? 's' : ''} {t('profile.available')}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>

          {activeAccount && (
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <MaterialIcons name={'access-time'} color={'#000'} size={22} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{t('profile.lastLogin')}</Text>
                  <Text style={styles.settingSubtitle}>
                    {formatDateHr(activeAccount?.lastLoginAt, false)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <AccountSwitcher
        visible={showAccountSwitcher}
        onClose={() => setShowAccountSwitcher(false)}
        onAddAccount={handleAddAccount}
      />

      <AddAccountScreen visible={showAddAccount} onClose={() => setShowAddAccount(false)} />
    </View>
  );
};

export default ProfileTab;
