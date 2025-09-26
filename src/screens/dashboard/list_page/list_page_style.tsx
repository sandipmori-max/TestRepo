import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 0,
    backgroundColor: '#F8F9FA',
  },
   profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    color: '#222',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  infoBlock: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  detailsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailKey: {
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  detailValue: {
    flex: 2,
    textAlign: 'right',
    color: '#333',
  },
  expandText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#007bff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flexShrink: 1,
  },

  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  active: {
    backgroundColor: '#4CAF50',
  },

  inactive: {
    backgroundColor: '#F44336',
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 10,
  },

  metaItem: {
    fontSize: 13,
    color: '#555',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  infoKey: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 13,
    color: '#222',
    fontWeight: '400',
    maxWidth: '60%',
    textAlign: 'right',
  },

  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },

  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  listContent: {
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderRow: {
    backgroundColor: '#eee',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    padding: 2,
    borderRightColor: '#ccc',
  },
  tableCell: {
    padding: 2,
    borderRightColor: '#ccc',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },

  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#6C757D',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
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
    marginBottom: 20,
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
  cancelButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
    marginBottom: 12,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignContent: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#6C757D',
  },
  errorText: {
    color: '#D9534F',
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leadIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  leadIconText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6C757D',
  },
  tooltipText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6C757D',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E9ECEF',
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chipDate: {
    backgroundColor: '#E3F2FD',
  },
  chipDateText: {
    color: '#1976D2',
  },
  chipAmount: {
    backgroundColor: '#E8F5E8',
  },
  chipAmountText: {
    color: '#388E3C',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeActive: {
    backgroundColor: '#D1E7DD',
  },
  badgeTextActive: {
    color: '#0F5132',
  },
  badgeInactive: {
    backgroundColor: '#F8D7DA',
  },
  badgeTextInactive: {
    color: '#721C24',
  },
  metaContainer: {
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#6C757D',
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 44,
    right: 18,
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR, 
    borderRadius: 56,
    elevation: 5,
    height: 56,
    width: 56,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent:'center',
    justifyContent:'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
