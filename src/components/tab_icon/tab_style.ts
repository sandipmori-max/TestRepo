 import { ERP_COLOR_CODE } from '../../utils/constants';

export const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: (size: number, focused: boolean, color: string) => ({
    width: size,
    height: size,
    tintColor: color,
    resizeMode: 'contain',
  }),
  activeLine: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    marginBottom: 4,
  },
};
