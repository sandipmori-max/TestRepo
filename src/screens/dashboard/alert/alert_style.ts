import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: ERP_COLOR_CODE.ERP_333,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: ERP_COLOR_CODE.ERP_BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: ERP_COLOR_CODE.ERP_COLOR,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ERP_COLOR_CODE.ERP_333,
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  sender: {
    fontSize: 12,
    color: '#777',
  },
  timeText: {
    fontSize: 10,
    color: '#777',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: ERP_COLOR_CODE.ERP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  senderName: {
    fontSize: 14,
    color: '#555',
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '12%'
  },
});
