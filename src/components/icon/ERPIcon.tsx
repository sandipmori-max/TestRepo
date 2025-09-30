import { ActivityIndicator, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { ERPIconProps } from './type';
import { baseStyle } from './icon_style';
import { ERP_COLOR_CODE } from '../../utils/constants';

const ERPIcon: React.FC<ERPIconProps> = ({
  name,
  isMenu = false,
  onPress,
  extStyle,
  extSize = 20,
  color = ERP_COLOR_CODE.ERP_WHITE,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[baseStyle(color, isMenu), extStyle]}>
      {isLoading ? (
        <ActivityIndicator color={ERP_COLOR_CODE.ERP_WHITE} size={'small'} />
      ) : (
        <MaterialIcons name={name} color={color} size={extSize} />
      )}
    </TouchableOpacity>
  );
};

export default ERPIcon;
