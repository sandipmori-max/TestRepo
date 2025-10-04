import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const HtmlRow = ({ item }: any) => {
  console.log('🚀 ~ HtmlRow ~ item:', item);
  const { width } = useWindowDimensions();
  const source = {
    html: item?.text,
  };

  return (
    <View>
      <View style={{ marginTop: 0 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>{item?.fieldtitle}</Text>
          {item?.tooltip !== item?.fieldtitle && <Text> - ( {item?.tooltip} ) </Text>}
          {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
        </View>
      </View>
      <RenderHtml contentWidth={width} source={source} />
    </View>
  );
};

export default HtmlRow;
