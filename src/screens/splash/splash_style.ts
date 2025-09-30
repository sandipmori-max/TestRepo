import { Dimensions, StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../utils/constants';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoWrapper: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 24,
    marginBottom: 30,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 100,
  },
  title: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
