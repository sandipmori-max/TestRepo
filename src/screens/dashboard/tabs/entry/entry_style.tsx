import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 104, 0.3)',
  },
  iconText: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    opacity: 0.5,
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: ERP_COLOR_CODE.ERP_BLACK,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(75, 73, 73, 0.85)',
    textAlign: 'center',
  },
});
