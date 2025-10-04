import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const Input = ({ item, errors, value, setValue, onFocus }: any) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>
      <TextInput
        style={[styles.textInput, errors[item.field] && { borderColor: ERP_COLOR_CODE.ERP_ERROR }]}
        keyboardType={item?.ctltype === 'NUMERIC' ? 'number-pad' : 'default'}
        value={value.toString()}
        onChangeText={text => setValue(text)}
        placeholder={`Enter ${item?.fieldtitle}`}
        onFocus={onFocus}
      />
      {errors[item.field] && (
        <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR, marginTop: 4 }}>{errors[item.field]}</Text>
      )}
    </View>
  );
};

export default Input;
