import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import FullViewLoader from '../../../components/loader/FullViewLoader';
import { ERP_COLOR_CODE } from '../../../utils/constants';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'http://www.deverp.com/index.aspx?q=deverp_privacy_policy' }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <FullViewLoader />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE, 
  },
});

export default PrivacyPolicyScreen;
