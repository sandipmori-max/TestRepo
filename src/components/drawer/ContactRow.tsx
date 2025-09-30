import MaterialIcons from '@react-native-vector-icons/material-icons';
import { View, Text, Linking, TouchableOpacity } from 'react-native'; 
import { ERP_COLOR_CODE } from '../../utils/constants';
const ContactRow = () => {
  const phoneNumber = '7935312554';
  const emailAddress = 'support@deverp.com';

  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  return (
    <View style={{ marginVertical: 4, flexDirection: 'row', gap: 12 }}>
      {/* Phone */}
      <TouchableOpacity
        onPress={handlePhonePress}
        style={{
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons
          size={14}
          color={ERP_COLOR_CODE.ERP_BLACK}
          name="phone"
        />
        <Text>{phoneNumber}</Text>
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity
        onPress={handleEmailPress}
        style={{
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons
          size={14}
          color={ERP_COLOR_CODE.ERP_BLACK}
          name="email"
        />
        <Text>{emailAddress}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactRow;
