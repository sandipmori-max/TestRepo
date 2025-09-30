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
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  cardHeader: {
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#007bff',
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
