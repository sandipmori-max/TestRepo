import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AttendanceScreen from '../screens/dashboard/attendance/AttendanceScreen';
import DisplayScreen from '../screens/dashboard/display/DisplayScreen';
import AlertScreen from '../screens/dashboard/alert/AlertScreen';
import PrivacyPolicyScreen from '../screens/dashboard/privacy/PrivacyPolicyScreen';
import TabNavigator from './TabNavigator';
import CustomDrawerContent from '../components/drawer/CustomDrawerContent';
import useTranslations from '../hooks/useTranslations';
import { useAppSelector } from '../store/hooks';
import { ERP_COLOR_CODE } from '../utils/constants';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { t } = useTranslations();
  const theme = useAppSelector(state => state.theme);

  return (
  <>
    
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme === 'dark' ? ERP_COLOR_CODE.ERP_BLACK : ERP_COLOR_CODE.ERP_APP_COLOR,
          },
          headerTintColor: ERP_COLOR_CODE.ERP_WHITE,
          title: t('navigation.home'),
        }}
        component={TabNavigator}
      />
      <Drawer.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: t('navigation.attendance') }}
      />
      {/* <Drawer.Screen
        name="Tasks"
        component={DisplayScreen}
        options={{ title: t('navigation.display') }}
      /> */}
      <Drawer.Screen
        name="Alert"
        component={AlertScreen}
        options={{ title: t('navigation.alert') }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{ title: t('navigation.privacyPolicy') }}
      />
    </Drawer.Navigator>
  </>
  );
};

export default DrawerNavigator;
