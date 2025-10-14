import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ERPTextInputProps } from './type';
import { styles } from './input_style';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { ERP_COLOR_CODE } from '../../utils/constants';

const ERPTextInput: React.FC<ERPTextInputProps> = ({
  label,
  error,
  touched,
  helperText,
  secureTextEntry,
  showToggle = false,
  icon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  helperStyle,
  field,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label ? <Text style={[styles.inputLabel, labelStyle]}>{label}</Text> : null}

      <View style={styles.inputWrapper}>
        <View
          style={[
            styles.inputContainer,
            {
              alignContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
              paddingLeft: 12,
            },
          ]}
        >
          <MaterialIcons name={
            field === 'company_code' ? 'closed-caption-off' : field === 'user' ? 'person' : 'password' 
          } size={20} color={ERP_COLOR_CODE.ERP_999} />

          <TextInput
            style={[
              styles.input,
              inputStyle,
              { paddingRight: showToggle && secureTextEntry ? 36 : 12 },
            ]}
            secureTextEntry={secureTextEntry && !showPassword}
            {...rest}
          />
        </View>

        {showToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(s => !s)}
            style={styles.toggleButton}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <MaterialIcons
              name={!showPassword ? 'visibility-off' : 'visibility'}
              color={ERP_COLOR_CODE.ERP_999}
              size={20}
            />
          </TouchableOpacity>
        )}

        {icon}
      </View>

      {helperText && !error && <Text style={[styles.helperText, helperStyle]}>{helperText}</Text>}
      {touched && !!error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

export default ERPTextInput;
