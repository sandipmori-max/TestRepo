import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:ERP_COLOR_CODE.ERP_WHITE
  },
  scrollContainer: {
    flex: 1,
    backgroundColor:ERP_COLOR_CODE.ERP_WHITE
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchButtonText: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontSize: 24,
    fontWeight: '600',
    bottom: 2,
  },
  profileCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.6,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE
    
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_666,
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
     borderWidth: 0.6,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  settingCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_666,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#999',
  },
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addAccountButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addAccountButtonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_REMOVE_BUTTON,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editProfileBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  
});
