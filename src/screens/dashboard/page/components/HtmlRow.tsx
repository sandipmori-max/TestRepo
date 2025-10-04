import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';

const HtmlRow = ({ item }: any) => {
  console.log("🚀 ~ HtmlRow ~ item:", item)
  const { width } = useWindowDimensions();
  const source = {
    html: item?.text,
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <RenderHtml contentWidth={width} source={source} />
    </View>
  );
};

export default HtmlRow;
