import { Platform, StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE || ERP_COLOR_CODE.ERP_WHITE,
    marginTop: Platform.OS === 'android' ? 4 : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE || ERP_COLOR_CODE.ERP_WHITE,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE || ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 280,
  },
  spinner: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: ERP_COLOR_CODE.ERP_ACTIVE_BACKGROUND || ERP_COLOR_CODE.ERP_007AFF,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  webviewLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  webviewLoadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  webviewSpinner: {
    marginBottom: 16,
  },
  webviewLoadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: ERP_COLOR_CODE.ERP_ACTIVE_BACKGROUND || ERP_COLOR_CODE.ERP_007AFF,
    textAlign: 'center',
  },
});
