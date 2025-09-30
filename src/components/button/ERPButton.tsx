import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ERPButtonProps } from './type';
import { styles } from './style';
import { ERP_COLOR_CODE } from '../../utils/constants';

const ERPButton: React.FC<ERPButtonProps> = ({
  text = '',
  onPress,
  color = ERP_COLOR_CODE.ERP_COLOR,
  disabled = false,
  style,
  textStyle,
  activeOpacity = 0.8,
}) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color, opacity: disabled ? 0.6 : 1 }, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
  >
    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

export default ERPButton;
