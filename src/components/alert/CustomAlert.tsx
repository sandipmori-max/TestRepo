import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';

import { CustomAlertProps } from '../types';
import { getGifSource } from '../../utils/helpers';
import { styles } from './custom_alert_style';
import { getAlertStyles } from './helper';
import ERPTextInput from '../input/ERPTextInput';
import { ERP_COLOR_CODE } from '../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  onClose,
  onDone,
  onCancel,
  doneText = 'Done',
  cancelText = 'Cancel',
  isFromButtonList = false,
  actionLoader,
  color = ERP_COLOR_CODE.ERP_BLACK,
  isBottomButtonVisible,
  isSettingVisible,
}) => {
  const alertStyles = getAlertStyles(type);
  const gifSource = getGifSource(type);

  const [remarks, setRemarks] = useState<any>('');
  const [error, setError] = useState<any>('');

  const handleChangedRemarks = (val: string) => {
    setRemarks(val);
    if (val && val.trim().length > 0) {
      setError('');
    }
  };

  const handleDonePress = () => {
    if (isFromButtonList && remarks && remarks?.trim() === '') {
      setError('Remarks are required.');
      return;
    }
    if (onDone) {
      onDone(remarks);
    }
  };

  useEffect(() => {
    if (visible) {
      setRemarks('');
      setError('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.bottomSheet, alertStyles.container]}>
          <View style={styles.header}>
            <Text style={alertStyles.title}>{title || ''}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>
          {!isFromButtonList && (
            <FastImage
              source={gifSource}
              style={styles.gif}
              resizeMode={FastImage.resizeMode.contain}
              
            />
          )}
          {isFromButtonList ? (
            <View style={{ width: '100%' }}>
              <Text
                style={[
                  alertStyles.message,
                  { textAlign: 'left', fontSize: 14, fontWeight: '800' },
                ]}
              >
                {message || ''}
              </Text>

              <ERPTextInput
                label={'Remarks'}
                placeholder={'Enter remarks'}
                placeholderTextColor={ERP_COLOR_CODE.ERP_999}
                autoCapitalize="none"
                onChangeText={handleChangedRemarks}
                value={remarks}
                labelStyle={[styles.inputLabel, { fontWeight: '400', fontSize: 12 }]}
                inputStyle={[styles.input]}
              />
              {error ? (
                <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>{error || ''}</Text>
              ) : null}
            </View>
          ) : (
            <>
              {' '}
              <Text style={alertStyles.message}>{message || ''}</Text>
            </>
          )}
          {isBottomButtonVisible && (
            <>
              {(onDone || onCancel) && (
                <View style={styles.buttonRow}>
                  {onCancel && (
                    <TouchableOpacity
                      style={styles.buttonCancel}
                      onPress={() => {
                        setRemarks('');
                        setError('');
                        onCancel();
                      }}
                    >
                      <Text style={styles.buttonText}>{cancelText}</Text>
                    </TouchableOpacity>
                  )}
                  {onDone && (
                    <>
                      {actionLoader ? (
                        <>
                          <TouchableOpacity style={styles.buttonCancel}>
                            <ActivityIndicator size={'small'} color={ERP_COLOR_CODE.ERP_BLACK} />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          {' '}
                          <TouchableOpacity
                            style={[styles.button, { backgroundColor: color }]}
                            onPress={() => {
                              setRemarks('');
                              setError('');
                              handleDonePress();
                            }}
                          >
                            <Text style={styles.buttonText}>{doneText}</Text>
                          </TouchableOpacity>{' '}
                        </>
                      )}
                    </>
                  )}
                </View>
              )}
            </>
          )}
          {isSettingVisible && (
            <TouchableOpacity
             onPress={() => Linking.openSettings()}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="settings" size={20} color="#000" />
                <Text style={{ color: ERP_COLOR_CODE.ERP_BLACK, fontWeight: '600', fontSize: 16 }}>
                  Open Settings
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
