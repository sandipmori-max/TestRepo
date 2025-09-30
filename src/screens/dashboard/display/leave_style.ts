import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  profileCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 8,
    },

  formGroup: {
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: ERP_COLOR_CODE.ERP_444,
    marginBottom: 6,
  },

  input: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },

  inputReadonly: {
    backgroundColor: '#f1f3f6',
    color: ERP_COLOR_CODE.ERP_555,
  },

  statusBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    textAlign: 'center',
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontWeight: '600',
    fontSize: 16,
  },

  optionBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  optionBtnSelected: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },

  optionText: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_333,
    textAlign: 'center',
  },

  optionTextSelected: {
    color: ERP_COLOR_CODE.ERP_WHITE,
  },

  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },

  attachBtn: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    padding: 10,
  },

  attachFileName: {
    fontSize: 13,
    marginTop: 6,
    color: ERP_COLOR_CODE.ERP_444,
  },

  submitBtn: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },

  submitText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
