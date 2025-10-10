import React, { useRef, useEffect } from 'react';
import { Animated, Text, View, useWindowDimensions, Dimensions } from 'react-native';
import AutoHeightWebView from '../../page/components/AutoHeightWebView';

const { width } = Dimensions.get('screen');

const MarqueeFooter = ({ html }) => {
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -250,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={{ overflow: 'hidden', backgroundColor: '#f0f8ff', padding: 10, borderRadius: 5 }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        <Text>{html.replace(/<[^>]+>/g, '')}</Text>
      </Animated.View>
    </View>
  );
};

const Footer = ({ footer, index, accentColors , isHorizontal, isFromMenu, textColor, isFromListPage}) => {
  console.log("🚀 ~ Footer ~ footer:", footer)
  const isHTML = typeof footer === 'string' && footer.trim().startsWith('<');
  const isMarquee = footer.includes('<marquee');
  console.log("🚀 ~ Footer ~ isMarquee:", isMarquee)

  if (isMarquee) {
    return <MarqueeFooter html={footer} />;
  } else if (isHTML) {
    return <AutoHeightWebView isFromListPage={isFromListPage} textColor={textColor} isHorizontal={isHorizontal} isFromMenu={isFromMenu} isFromPage={false} html={footer} />;
  } else {
    return (
      <Text
        style={{
          color: accentColors[index % accentColors.length],
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {footer}
      </Text>
    );
  }
};

export default Footer;
