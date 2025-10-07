import React, { useRef, useEffect } from "react";
import { Animated, Text, View, useWindowDimensions, Dimensions } from "react-native";
import RenderHTML from "react-native-render-html";
 
const { width } = Dimensions.get('screen');

const MarqueeFooter = ({ html }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -250,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={{ overflow: "hidden", backgroundColor: "#f0f8ff", padding: 10, borderRadius: 5 }}>
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX }] }}>
        <Text>{html.replace(/<[^>]+>/g, '')}</Text>
      </Animated.View>
    </View>
  );
};

// Main Footer Component
const Footer = ({ footer, index, accentColors }) => {
  const { width } = useWindowDimensions();

  const isHTML = typeof footer === "string" && footer.trim().startsWith("<");

  const isMarquee = isHTML && footer.includes("<marquee");

  if (isMarquee) {
    return <MarqueeFooter html={footer} />;
  } else if (isHTML) {
    return (
      <RenderHTML
        contentWidth={width}
        source={{ html: footer }}
        tagsStyles={{
          b: { fontWeight: "bold" },
          i: { fontStyle: "italic" },
          div: { flexDirection: "row" },
        }}
      />
    );
  } else {
    return <Text style={{ color: accentColors[index % accentColors.length], fontSize: 16, fontWeight: '600' }}>{footer}</Text>;
  }
};

export default Footer;
