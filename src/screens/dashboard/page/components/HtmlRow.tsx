import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import AutoHeightWebView from './AutoHeightWebView'; // the component above

const HtmlRow = ({ item, isFromPage }: any) => {
  return (
    <View>
      <View style={{ marginTop: 0 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>{item?.fieldtitle}</Text>
          {item?.tooltip !== item?.fieldtitle && <Text> - ( {item?.tooltip} ) </Text>}
          {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
        </View>
      </View>
      <AutoHeightWebView
        html={item?.text}
        isFromPage={isFromPage}
        isHorizontal={false}
        isFromMenu={false}
        textColor={undefined}
        isFromListPage={undefined}
      />
    </View>
  );
};

export default HtmlRow;
