import { Dimensions, StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { marginRight: 8 },
  backIcon: { fontSize: 20, color: '#222' },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  dateRow: {
    flex: 1,
    marginRight: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
   },
  dateButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  datePickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  datePickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  datePickerDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  recordPunchTime: {
    fontSize: 14,
    color: '#555555ff',
    marginTop: 2,
  },

  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  selfyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 14,
  },
  imageCol: { flex: 1, alignItems: 'center' },
  imageLabel: { marginTop: 6, fontSize: 12, color: '#666' },
  placeholderAvatar: { backgroundColor: '#e0e0e0' },
  formGroup: {
    marginBottom: 12,
  },
  formRow: { flexDirection: 'row' },
  label: { fontSize: 14, color: '#000', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  inputReadonly: {
    backgroundColor: '#F0F0F0',
    color: '#555',
  },
  errorText: { color: '#dc3545', fontSize: 12, marginTop: 4 },
  name: { fontSize: 17, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#555' },
  phone: { fontSize: 13, color: '#888' },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: { fontSize: 12, color: '#666', marginTop: 6 },
  loaderOverlay: {},
  listSection: {
    paddingHorizontal: 16,
    marginTop: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },

  recordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  recordName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  recordEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  recordDateTime: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },

  statusBadge: (status: 'checkin' | 'checkout') => ({
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: status === 'checkin' ? '#28a745' : '#dc3545',
    alignSelf: 'flex-start',
  }),

  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#696969ff',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});
