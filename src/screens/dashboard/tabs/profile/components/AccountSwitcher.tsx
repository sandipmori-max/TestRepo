import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { styles } from './components_style';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { removeAccountThunk, switchAccountThunk } from '../../../../../store/slices/auth/thunk';
import { Account } from '../../../../../store/slices/auth/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevERPService } from '../../../../../services/api';
import CustomAlert from '../../../../../components/alert/CustomAlert';
import { ERP_ICON } from '../../../../../assets';
import { useApi } from '../../../../../hooks/useApi';
import { formatDateHr, formatTimeTo12Hour, isTokenValid } from '../../../../../utils/helpers';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FastImage from 'react-native-fast-image';
import { useBaseLink } from '../../../../../hooks/useBaseLink';
import { ERP_COLOR_CODE } from '../../../../../utils/constants';

interface AccountSwitcherProps {
  visible: boolean;
  onClose: () => void;
  onAddAccount: () => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ visible, onClose, onAddAccount }) => {
  const dispatch = useAppDispatch();
  const { execute: validateCompanyCode } = useApi();

  const { accounts, activeAccountId } = useAppSelector(state => state?.auth);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const handleSwitchAccount = (accountId: string) => {
    if (accountId !== activeAccountId) {
      dispatch(switchAccountThunk(accountId));
    }
    onClose();
  };

  const handleRemovedAccount = (accountId: string) => {
    if (accountId !== activeAccountId) {
      dispatch(removeAccountThunk(accountId));
    }
    onClose();
  };

  const handleRemoveAccount = (account: Account) => {
    setAlertConfig({
      title: 'Remove Account',
      message: `Are you sure you want to remove ${account?.user?.company_code}?`,
      type: 'error',
    });
    setSelectedAccount(account?.id);
    setAlertVisible(true);
  };

  const renderAccount = ({ item }: { item: any }) => {
    const isActive = item?.id.toString() === activeAccountId?.toString();
    const lastLogin = formatDateHr(item?.lastLoginAt, false);
    const lastLoginHr = formatTimeTo12Hour(item?.lastLoginAt);

    let normalizedBase = (item?.user?.companyLink || '').replace(/\/+$/, '');
    normalizedBase = normalizedBase.replace(/\/devws\/?/, '/');
    normalizedBase = normalizedBase.replace(/^https:\/\//i, 'http://');

    return (
      <TouchableOpacity
        style={[styles.accountItem, isActive && styles.activeAccount]}
        onPress={async () => {
          DevERPService.setAppId(item?.user?.app_id || '');
          await AsyncStorage.setItem('appid', item?.user?.app_id);

          if (isTokenValid(item?.user?.tokenValidTill)) {
            DevERPService.setToken(item?.user?.token || '');
            await AsyncStorage.setItem('erp_token', item?.user?.token || '');
            await AsyncStorage.setItem('auth_token', item?.user?.token || '');
            await AsyncStorage.setItem('erp_token_valid_till', item?.user?.token || '');
            const validation = await validateCompanyCode(() =>
              DevERPService.validateCompanyCode(item?.user?.company_code),
            );
            if (!validation?.isValid) {
              return;
            }
            handleSwitchAccount(item?.id);
          } else {
            const validation = await validateCompanyCode(() =>
              DevERPService.validateCompanyCode(item?.user?.company_code),
            );
            if (!validation?.isValid) {
              return;
            }
            handleSwitchAccount(item?.id);
          }
        }}
      >
        <View style={styles.accountContent}>
          <FastImage
            source={{
              uri: `${normalizedBase}/FileUpload/1/UserMaster/${
                item?.user?.id
              }/profileimage.jpeg?ts=${new Date().getTime()}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.web,
            }}
            style={styles.avatar}
          />

          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, isActive && styles.activeText]}>
              {item?.user?.name.charAt(0).toUpperCase() + item?.user?.name.slice(1)}
            </Text>
            <Text numberOfLines={1} style={[styles.accountEmail, isActive && styles.activeText]}>
              {item?.user?.companyName}
            </Text>

            <View
              style={{
                width: isActive ? '100%' : '80%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  gap: 2,
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name={'date-range'} color={ERP_COLOR_CODE.ERP_BLACK} size={18} />
                <Text style={styles.lastLogin}> {lastLogin}</Text>
              </View>

              <View
                style={{
                  gap: 2,
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name={'access-alarm'} color={ERP_COLOR_CODE.ERP_BLACK} size={18} />
                <Text style={styles.lastLogin}>{lastLoginHr}</Text>
              </View>
            </View>
          </View>
          {isActive && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeLabel}>Active</Text>
            </View>
          )}
        </View>
        {!isActive && accounts?.length > 1 && (
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveAccount(item)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={ERP_ICON.BACK} style={styles.back} />
          </TouchableOpacity>
          <Text style={styles.title}>Switch Account</Text>
        </View>

        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={item => item?.id}
          style={styles.accountsList}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.addAccountButton} onPress={onAddAccount}>
          <Text style={styles.addAccountText}>+ Add Another Account</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        isBottomButtonVisible={true}
        onClose={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
        onDone={() => {
          handleRemovedAccount(selectedAccount);
        }}
        doneText="Remove"
        color={ERP_COLOR_CODE.ERP_ERROR}
        actionLoader={undefined}
      />
    </Modal>
  );
};

export default AccountSwitcher;
