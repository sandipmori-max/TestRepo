import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { useAppSelector } from '../../store/hooks';
import { firstLetterUpperCase } from '../../utils/helpers';
import { ERP_DRAWER_LIST } from '../../constants';
import { styles } from './drawer_style';
import FastImage from 'react-native-fast-image';
import { useBaseLink } from '../../hooks/useBaseLink';
import { ERP_COLOR_CODE } from '../../utils/constants';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const navigation = useNavigation();

  const { user } = useAppSelector(state => state?.auth);
  const theme = useAppSelector(state => state.theme);
  const baseLink = useBaseLink();

  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: theme === 'dark' ? 'black' : 'white' }}
    >
      <View style={[styles.header]}>
        <FastImage
          source={{
            uri: `${baseLink}/FileUpload/1/UserMaster/${
              user?.id
            }/profileimage.jpeg?ts=${new Date().getTime()}`,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.reload,
          }}
          style={styles.profileImage}
        />
        <>
          <View style={{ height: 25, width: 100 }}></View>
          <Text style={[styles.username, { top: 8 }]}>
            {firstLetterUpperCase(user?.name || '')}
          </Text>
          <View style={{ height: 2, width: 100 }}></View>

          <View
            style={{
              top: 18,
              width: '100%',
              marginVertical: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                padding: 6,
              }}
            >
              <MaterialIcons name={'call'} color={'white'} size={14} />
              <Text style={styles.userPhone}>{user?.mobileno || ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',

                alignContent: 'center',
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
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                padding: 6,
              }}
            >
              <MaterialIcons name={'person'} color={'white'} size={14} />

              <Text style={styles.userPhone}>{user?.rolename || ''}</Text>
            </View>
          </View>
          <View style={{ height: 15, width: 100 }}></View>
        </>
      </View>

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
                  color={isActive ? ERP_COLOR_CODE.ERP_WHITE : '#000'}
                  size={20}
                />
                <Text
                  style={[
                    styles.itemLabel,
                    isActive && styles.activeText,
                    {
                      color: isActive ? ERP_COLOR_CODE.ERP_WHITE : '#000',
                    },
                  ]}
                >
                  {item?.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.logoutButton}>
        <Text style={styles.logoutText}>DevERP Mobile App</Text>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
