import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 6,
    padding: 10,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  label: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_333,
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 10,
    padding: 10,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 10,
    padding: 12,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  dropdownCard: {
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    overflow: 'hidden',
    elevation: 3,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: ERP_COLOR_CODE.ERP_eee,
  },
  disabledBox: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f1f1f1',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 10,
    padding: 12,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: ERP_COLOR_CODE.ERP_ERROR,
    marginBottom: 6,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
