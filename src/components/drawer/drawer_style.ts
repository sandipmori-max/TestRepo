import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../utils/constants';

export const styles = StyleSheet.create({
  header: {
    top: 38,
    padding: 10,
    alignItems: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderRadius: 8
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderWidth: 2,
    top: -40,
    position:'absolute',
    borderColor: ERP_COLOR_CODE.ERP_WHITE
  },
  username: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },

  userPhone: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 12,
    marginLeft: 6,
  },
  emailid:{
    color: ERP_COLOR_CODE.ERP_WHITE,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
    top: 30
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  itemLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: ERP_COLOR_CODE.ERP_007AFF,
    fontWeight: 'bold',
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 6,
  },
  activeItemBackground: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderLeftWidth: 4,
    borderLeftColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderRadius: 8,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    alignContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
  
});
