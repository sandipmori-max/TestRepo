import React, { useState, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import WebView from 'react-native-webview';
import RenderHTML from 'react-native-render-html';

const AutoHeightWebView = ({
  html,
  isFromPage,
  isHorizontal,
  isFromMenu,
  textColor,
}: {
  html: string;
  isFromPage?: boolean;
  isHorizontal: any;
  isFromMenu: any;
  textColor: any;
}) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const { width } = useWindowDimensions();
  const webviewRef = useRef<WebView>(null);

  const defaultCSS = `
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-y: scroll;
        overflow-x: scroll;
        background-color: #fff !important;
      }
      * {
        color: #222 !important;
        font-family: -apple-system, Roboto, 'Segoe UI', sans-serif !important;
        font-size: 15px !important;
        box-sizing: border-box !important;
        word-wrap: break-word !important;
      }
      body > *:last-child { margin-bottom: 0 !important; }
      table {
        height: 100% !important;
        width: ${isFromPage ? '92%' : '82%'} !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        word-break: break-word !important;
      }
      th, td {
        border: 1px solid #ccc !important;
        padding: 6px !important;
        text-align: left !important;
      }
      th {
        background: #f1f1f1 !important;
        font-weight: bold !important;
      }
      tr:nth-child(even) { background: #fafafa !important; }
      img { max-width: 100% !important; height: auto !important; display: block !important; }
      div, p, span, h1,h2,h3,h4,h5,h6 {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
    </style>
  `;

  const formattedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        ${defaultCSS}
      </head>
      <body>${html}</body>
    </html>
  `;

  const injectedJS = `
    (function() {
      function sendHeight() {
        const body = document.body;
        const html = document.documentElement;
        const height = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        window.ReactNativeWebView.postMessage(height.toString());
      }

      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);

      sendHeight(); // initial
    })();
    true;
  `;

  return (
    <View
      style={{
        overflow: 'scroll',
        width,
        backgroundColor: '#fff',
      }}
    >
      {html.includes('<table ') ? (
        <WebView
          ref={webviewRef}
          source={{ html: formattedHTML }}
          style={{ width, height: webViewHeight || 100, backgroundColor: '#fff' }}
          injectedJavaScript={injectedJS}
          onMessage={event => {
            const height = Number(event.nativeEvent.data);
            if (!isNaN(height) && height > 0) {
              setWebViewHeight(height);
            }
          }}
          scrollEnabled={false}
          originWhitelist={['*']}
        />
      ) : (
        <>
          <RenderHTML
            contentWidth={width}
            source={{ html: html }}
            tagsStyles={{
              b: {
                fontWeight: 'bold',
                flexDirection: 'row',
                overflow: 'hidden',
                color: isFromMenu ? textColor : '#000',
                maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
              },
              strong: {
                fontSize: 16,
                fontWeight: 'bold',
                flexDirection: 'row',
                overflow: 'hidden',
                color: isFromMenu ? textColor : '#000',
                maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
              },
              p: {
                fontWeight: 'bold',
                flexDirection: 'row',
                overflow: 'hidden',
                color: isFromMenu ? textColor : '#000',
                maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
              },
              i: { fontStyle: 'italic' },

              div: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                maxWidth: width,
              },
            }}
          />
        </>
      )}
    </View>
  );
};

export default AutoHeightWebView;
