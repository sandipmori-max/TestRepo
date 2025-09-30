import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import useTranslations from '../../../hooks/useTranslations';
import FullViewLoader from '../../../components/loader/FullViewLoader';
import { styles } from './web_style';
import { useBaseLink } from '../../../hooks/useBaseLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ERPIcon from '../../../components/icon/ERPIcon';

const WebScreen = () => {
  const { t } = useTranslations();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { item, isFromChart } = route.params;
  const [token, setToken] = useState<string>('');
  const [isHidden, setIsHidden] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const baseLink = useBaseLink();

  const url = isFromChart ? `${baseLink}app/index.html?dashboard/0/&token=${token}` : '';

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('erp_token');
      setToken(storedToken || '');
    })();
  }, []);

  const toggleDiv = () => {
    const jsCode = `
      (function() {
        const div = document.getElementById('divPage');
        if (div) {
          div.style.display = '${isHidden ? 'block' : 'none'}';
        }
      })();
      true;
    `;
    webviewRef?.current?.injectJavaScript(jsCode);
    setIsHidden(prev => !prev);
  };

  const reloadWebView = () => {
    setIsReloading(true);
    webviewRef?.current?.reload();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          numberOfLines={1}
          style={{ maxWidth: 180, fontSize: 18, fontWeight: '700', color: ERP_COLOR_CODE.ERP_WHITE }}
        >
          {isFromChart ? 'Dashboard' : item?.title || t('webScreen.details')}
        </Text>
      ),
      headerRight: () => (
        <>
          {isFromChart || item?.title === 'Attendance Code' ? (
            <>
              <ERPIcon name={'refresh'} onPress={reloadWebView} />
            </>
          ) : (
            <>
              <ERPIcon name={'refresh'} onPress={reloadWebView} />
              <ERPIcon name={'filter-alt'} onPress={toggleDiv} />
            </>
          )}
        </>
      ),
    });
  }, [navigation, item?.title, t, isHidden]);

  const targetUrl = useMemo(() => {
    const itemUrl = item?.url || '';
    if (!itemUrl || !token) return '';
    if (/^https?:\/\//i.test(itemUrl)) {
      const baseUrl = itemUrl?.replace(/^https:\/\//i, 'http://');
      const separator = baseUrl?.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}token=${token}`;
    }

    const cleanedPath = itemUrl?.replace(/^\/+/, '');
    const fullUrl = baseLink + cleanedPath;
    const separator = fullUrl?.includes('?') ? '/' : '?';
    return `${fullUrl}${separator}&token=${token}`;
  }, [baseLink, item?.url, token]);

  console.log('🚀 ~ targetUrl btnNew:', targetUrl);

  if ((!isFromChart && !targetUrl) || (isFromChart && !url)) {
    return (
      <SafeAreaView style={styles.container}>
        <FullViewLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={ERP_COLOR_CODE.ERP_APP_COLOR} translucent={false} />
      {token ? (
        <>
          <WebView
            ref={webviewRef}
            source={{ uri: isFromChart ? url : targetUrl }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webview}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEnabled={true}
            decelerationRate={0.998}
            cacheEnabled={true}
            cacheMode="LOAD_DEFAULT"
            renderLoading={() => (
              <View style={styles.webviewLoadingContainer}>
                <View style={styles.webviewLoadingContent}>
                  <FullViewLoader />
                </View>
              </View>
            )}
            allowsBackForwardNavigationGestures={true}
            textZoom={100}
            allowsLinkPreview={false}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: -', nativeEvent);
              setIsReloading(false);
            }}
            onLoadStart={() => {
              console.log('WebView loading started');
              setIsReloading(true);
            }}
            onLoadEnd={() => {
              console.log('WebView loading finished');
              setIsReloading(false);
              // const jsCode = `
              //   (function() {
              //     const div = document.getElementById('divPage');
              //     if (div) {
              //       div.style.display = 'none';
              //     }
              //   })();
              //   true;
              // `;
              // webviewRef.current?.injectJavaScript(jsCode);
              // setIsHidden(true)
            }}
            injectedJavaScript={`
              (function() {
                const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                const allClasses = Array.from(document.querySelectorAll('[class]')).map(el => el.className);
                window.ReactNativeWebView.postMessage(JSON.stringify({ ids: allIds, classes: allClasses }));
              })();
              true;
            `}
            onMessage={event => {
              console.log('✅ WebView sent a message!');
              const data = JSON.parse(event.nativeEvent.data);
              console.log('All IDs:', data.ids);
              console.log('All Classes:', data.classes);
            }}
          />
        </>
      ) : (
        <FullViewLoader />
      )}
    </SafeAreaView>
  );
};

export default WebScreen;
