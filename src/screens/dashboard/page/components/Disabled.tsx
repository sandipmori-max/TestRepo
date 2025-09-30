import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { formatDateHr } from '../../../../utils/helpers';

const Disabled = ({ item, value, type }: any) => {
  console.log("🚀 ~ Disabled ~ item:", item);
  console.log("🚀 ~ Disabled ~ value:", value);

  const getDisplayValue = () => {
    if (type === 'DATETIME') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatDateHr(date, true);
      } else {
        return value || '-';
      }
    }
    return value || '-';
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>
      <View style={styles.disabledBox}>
        <Text style={{ color: ERP_COLOR_CODE.ERP_555 }}>
          {getDisplayValue()}
        </Text>
      </View>
    </View>
  );
};

export default Disabled;
