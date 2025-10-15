import { TextInputProps, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

export interface ERPTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  icon?: React.ReactNode;

  containerStyle?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  inputStyle?: TextStyle | TextStyle[];
  errorStyle?: TextStyle | TextStyle[];
  helperStyle?: TextStyle | TextStyle[];
  field?: string;
}
