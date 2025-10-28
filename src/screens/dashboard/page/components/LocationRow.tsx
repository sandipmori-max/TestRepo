import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useCurrentAddress } from '../../../../hooks/useCurrentLocation';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const LocationRow = ({ locationVisible, isValidate, item, value, setValue }: any) => {
  const { coords, address: hookAddress, loading, error, refetch } = useCurrentAddress();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (item?.text !== '' && item?.text !== '#location') {
      setAddress(item?.text);
      return;
    }

    if (!loading && coords) {
      setValue({
        [item?.field]: `${coords?.latitude.toString()},${coords?.longitude.toString()}`,
      });
      setAddress(hookAddress || `${coords?.latitude},${coords?.longitude}`);
    }
  }, [coords, loading, locationVisible, hookAddress]);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>

      {/* Address / Loading / Error */}
      <View style={styles.disabledBox}>
        {loading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={ERP_COLOR_CODE.ERP_555} />
            <Text style={{ marginLeft: 8, color: ERP_COLOR_CODE.ERP_555 }}>
              Fetching current location...
            </Text>
          </View>
        ) : address ? (
          <Text style={{ marginTop: 4, color: ERP_COLOR_CODE.ERP_333 }}>{address}</Text>
        ) : (
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ marginTop: 4, color: '#999' }}>
              {error ? `Error: ${error}` : 'Address not found'}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 8,
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
              onPress={refetch}
            >
              <MaterialIcons name="refresh" color={'#fff'} size={18} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default LocationRow;
