import { StyleSheet, Dimensions } from 'react-native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const { width, height } = Dimensions.get('screen');
const itemWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: '100%',
    backgroundColor: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#000',
  },
  chartContainer: {
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '400',
  },

  dashboardSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  // Dashboard Item
  dashboardItem: {
    width: itemWidth,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 1,
    overflow: 'hidden',
  },
  dashboardItemContent: {
    padding: 16,
  },
  dashboardItemHeader: {
    marginBottom: 2,
  },
  dashboardItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerTextWrap: {
    flex: 1,
  },
  dashboardItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  dashboardItemSubtitle: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  reportBadge: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 10,
  },
  reportBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  dashboardItemBody: {
    marginBottom: 2,
  },
  dataContainer: {
    marginBottom: 0,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  dashboardItemData: {
    fontSize: 18,
    fontWeight: '700',
  },
  urlContainer: {
    marginBottom: 8,
  },
  urlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  dashboardItemUrl: {
    fontSize: 12,
    color: '#007AFF',
    lineHeight: 16,
  },
  actionIndicator: {
    alignItems: 'flex-end',
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerLink: {
    color: '#aaacadff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  chevron: {
    color: '#aaacadff',
    fontSize: 18,
    lineHeight: 18,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  cardAccent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginVertical: 4,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontWeight: '700',
    color:'#fff'
  },
  itemText: {
    flex: 1,
  },
  itemPrimary: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemSecondary: {
    fontSize: 12,
  },
  itemType: {
    fontSize: 12,
  },
});
