import { StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../utils/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
    inputContainer: {
    marginBottom: 16,
  },
   inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: ERP_COLOR_CODE.ERP_333,
  },
    input: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: ERP_COLOR_CODE.ERP_BLACK,
  },
  bottomSheet: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    minHeight: 220,
    maxHeight: 340,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  closeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    fontSize: 16,
    color: ERP_COLOR_CODE.ERP_666,
    fontWeight: 'bold',
  },
  gif: {
    width: 120,
    height: 120,
    marginBottom: 6,
  },
  errorContainer: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ERP_COLOR_CODE.ERP_ERROR,
  },
  errorMessage: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_666,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  successContainer: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  successMessage: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_666,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ERP_COLOR_CODE.ERP_COLOR,
  },
  infoMessage: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_666,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  button: {
    backgroundColor: ERP_COLOR_CODE.ERP_BLACK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  }, 
  buttonCancel: {
    backgroundColor: '#d0dce9ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontWeight: '600',
    fontSize: 14,
  },
});
