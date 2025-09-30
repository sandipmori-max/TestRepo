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
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: ERP_COLOR_CODE.ERP_BLACK,
  },
  toggleButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_ERROR,
    marginTop: 4,
  },
});
