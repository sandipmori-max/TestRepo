import { Dimensions, StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    borderRadius: 12,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    padding: 16
  },
  helperText: {
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_888,
    marginTop: 4,
    marginLeft: 2,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: ERP_COLOR_CODE.ERP_333,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: ERP_COLOR_CODE.ERP_666,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ERP_COLOR_CODE.ERP_444,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_ddd,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: ERP_COLOR_CODE.ERP_333,
  },
  errorText: {
    color: ERP_COLOR_CODE.ERP_ERROR,
    fontSize: 13,
    marginTop: 5,
  },
  errorContainer: {
     borderColor: ERP_COLOR_CODE.ERP_ERROR,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: ERP_COLOR_CODE.ERP_BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    marginTop: 12,
  },
  errorButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_DE_ACTIVE_BUTTON,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_f0f0f0,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: ERP_COLOR_CODE.ERP_666,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
