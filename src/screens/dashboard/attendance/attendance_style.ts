import {  StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE },
  backBtn: { marginRight: 8 },
  backIcon: { fontSize: 20, color: '#222' },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
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
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
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
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
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
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: ERP_COLOR_CODE.ERP_e0e0e0,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  recordPunchTime: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_555,
    marginTop: 2,
  },

  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: ERP_COLOR_CODE.ERP_666,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
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
  imageLabel: { marginTop: 6, fontSize: 12, color: ERP_COLOR_CODE.ERP_666 },
  placeholderAvatar: { backgroundColor: ERP_COLOR_CODE.ERP_e0e0e0 },
  formGroup: {
    marginBottom: 12,
  },
  formRow: { flexDirection: 'row' },
  label: { fontSize: 14, color: ERP_COLOR_CODE.ERP_BLACK, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_e0e0e0,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  inputReadonly: {
    backgroundColor: '#F0F0F0',
    color: ERP_COLOR_CODE.ERP_555,
  },
  errorText: { color: '#dc3545', fontSize: 12, marginTop: 4 },
  name: { fontSize: 17, fontWeight: 'bold' },
  email: { fontSize: 13, color: ERP_COLOR_CODE.ERP_555 },
  phone: { fontSize: 13, color: ERP_COLOR_CODE.ERP_888 },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    textAlign: 'center',
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontWeight: '600',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: { fontSize: 12, color: ERP_COLOR_CODE.ERP_666, marginTop: 6 },
  loaderOverlay: {},
  listSection: {
    paddingHorizontal: 16,
    marginTop: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ERP_COLOR_CODE.ERP_333,
    marginBottom: 12,
  },

  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
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
    color: ERP_COLOR_CODE.ERP_666,
    marginTop: 2,
  },

  recordDateTime: {
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_BLACK,
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
    color: ERP_COLOR_CODE.ERP_WHITE,
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
    color: ERP_COLOR_CODE.ERP_WHITE,
    marginBottom: 10,
  },
});
