import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FastImage from 'react-native-fast-image';

import { useAppSelector } from '../../store/hooks';
import { firstLetterUpperCase } from '../../utils/helpers';
import { ERP_DRAWER_LIST } from '../../constants';
import { styles } from './drawer_style';
import { useBaseLink } from '../../hooks/useBaseLink';
import { ERP_COLOR_CODE } from '../../utils/constants';
import ContactRow from './ContactRow';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state?.auth);
  const theme = useAppSelector(state => state.theme);
  const baseLink = useBaseLink();
  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: theme === 'dark' ? 'black' : 'white' }}
      showsVerticalScrollIndicator={true}
    >
      <View style={{ flex: 1, minWidth: '100%' }}>
        {/* Header */}
        <View style={styles.header}>
          <FastImage
            source={{
              uri: `${baseLink}/FileUpload/1/UserMaster/${
                user?.id
              }/profileimage.jpeg?ts=${new Date().getTime()}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.web,
            }}
            style={styles.profileImage}
          />
          <View style={{ height: 25, width: 100 }} />
          <Text style={[styles.username, { top: 8 }]}>
            {firstLetterUpperCase(user?.name || '')}
          </Text>
          <View style={{ height: 2, width: 100 }} />
          <View style={{ top: 18, width: '100%', marginVertical: 8 }}>
            {/* Phone */}
            {user?.mobileno && (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 6 }}
              >
                <MaterialIcons name={'call'} color={'white'} size={14} />
                <Text style={styles.userPhone}>{user?.mobileno || ''}</Text>
              </View>
            )}

            {/* Email */}
            {user?.emailid && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                  padding: 6,
                  marginVertical: 4,
                }}
              >
                <MaterialIcons name={'mail-outline'} color={'white'} size={14} />
                <Text numberOfLines={1} style={styles.userPhone}>
                  {user?.emailid || ''}
                </Text>
              </View>
            )}

            {/* Role */}
            {user?.rolename && (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 6 , marginBottom: 12}}
              >
                <MaterialIcons name={'person'} color={'white'} size={14} />
                <Text style={styles.userPhone}>{user?.rolename || ''}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Scrollable Menu */}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuContainer}>
            {ERP_DRAWER_LIST.map(item => {
              const isActive = currentRoute === item?.route;
              return (
                <TouchableOpacity
                  key={item?.route}
                  style={[styles.drawerItem, isActive && styles.activeItemBackground]}
                  onPress={() => {
                    if (item?.route === 'Home') {
                      props?.navigation.navigate('Home', { screen: 'Home' });
                      props?.navigation.closeDrawer();
                      return;
                    } else {
                      props?.navigation.closeDrawer();
                      navigation.navigate(item?.route as never);
                    }
                  }}
                >
                  <View style={styles.itemRow}>
                    <MaterialIcons
                      name={`${item?.icon}`}
                      color={isActive ? ERP_COLOR_CODE.ERP_WHITE : ERP_COLOR_CODE.ERP_BLACK}
                      size={20}
                    />
                    <Text
                      style={[
                        styles.itemLabel,
                        isActive && styles.activeText,
                        { color: isActive ? ERP_COLOR_CODE.ERP_WHITE : ERP_COLOR_CODE.ERP_BLACK },
                      ]}
                    >
                      {item?.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer - stays fixed at bottom */}
        <View style={styles.logoutButton}>
          <Text style={styles.logoutText}>(c) DevERP Solutions Pvt. Ltd.</Text>
          <ContactRow />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
