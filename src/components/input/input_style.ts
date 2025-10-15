import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../utils/constants';

export const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: ERP_COLOR_CODE.ERP_333,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: { 
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    width: '94%',
    color: ERP_COLOR_CODE.ERP_BLACK,
  },
  toggleButton: {
    position: 'absolute',
    right: 14,
    top: -8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_666,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_ERROR,
    marginTop: 4,
  },
});
