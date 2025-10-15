import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { formatDateHr } from '../../../../utils/helpers';

const DateTimeRow = ({isValidate, item, errors, value, showDateTimePicker }: any) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>
      <TouchableOpacity
        style={[styles.dateBox, 
          errors[item.field] && { borderColor: ERP_COLOR_CODE.ERP_ERROR },
        isValidate && item?.mandatory === '1' &&  value && {
            borderColor: 'green',
            borderWidth: 0.6
          },
        ]
        }
        onPress={() => showDateTimePicker(item?.field, value)}
      >
        <Text style={{ color: value ? ERP_COLOR_CODE.ERP_BLACK : ERP_COLOR_CODE.ERP_888 }}>
          {
           value ? formatDateHr(value, true) : 'dd/mmm/yyyy hh:mm'
          }
        </Text>
        <MaterialIcons name="event" size={20} color={ERP_COLOR_CODE.ERP_555}/>
      </TouchableOpacity>
      {errors[item.field] && (
        <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR, marginTop: 4 }}>{errors[item?.field]}</Text>
      )}
    </View>
  );
};

export default DateTimeRow;
