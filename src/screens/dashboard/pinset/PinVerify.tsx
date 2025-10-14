import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import { getDBConnection, getPinCode } from '../../../utils/sqlite';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../../components/alert/CustomAlert';

const { width } = Dimensions.get('screen');

const PinVerifyScreen = () => {
  const [pin, setPin] = useState<string>('');
  const navigation = useNavigation<any>();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleVerifyPin = async () => {
    if (pin.length < 4) {
      setAlertVisible(true);

      setAlertConfig({
        title: 'Error',
        message: 'Enter 4-digit PIN',
        type: 'error',
      });
      return;
    }

    try {
      const db = await getDBConnection();
      const savedPin = await getPinCode(db);

      if (savedPin === pin) {
        navigation.replace('Drawer');
      } else {
        setAlertVisible(true);

        setAlertConfig({
          title: 'Error',
          message: 'Incorrect PIN, try again',
          type: 'error',
        });
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setAlertVisible(true);

      setAlertConfig({
        title: 'Error verifying PIN',
        message: error?.toString() || '',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Verify PIN</Text>
      <Text style={styles.subtitle}>Enter your 4-digit PIN to continue</Text>

      {/* PIN Circles */}
      <View style={styles.pinRow}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.pinCircle,
              { backgroundColor: i < pin.length ? ERP_COLOR_CODE.ERP_APP_COLOR : '#e5e7eb' },
            ]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['del', '0', 'ok'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => {
                  if (key === 'del') handleDelete();
                  else if (key === 'ok') handleVerifyPin();
                  else handleKeyPress(key);
                }}
              >
                {key === 'del' ? (
                  <MaterialIcons name="backspace" size={28} color="#374151" />
                ) : key === 'ok' ? (
                  <MaterialIcons
                    name="check-circle"
                    size={36}
                    color={pin.length === 4 ? '#16a34a' : '#9ca3af'}
                  />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => {
          setAlertVisible(false);
        }}
        actionLoader={undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 40,
  },
  pinRow: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  pinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginHorizontal: 8,
  },
  keypad: {
    width: width * 0.8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
});

export default PinVerifyScreen;
