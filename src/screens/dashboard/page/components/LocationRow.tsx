import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useCurrentAddress } from '../../../../hooks/useCurrentLocation';

const LocationRow = ({ item, value, setValue }: any) => {
  console.log('🚀 ~ LocationRow ~ item:', item);
  const { coords, loading, error } = useCurrentAddress();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (item?.text !== '' && item?.text) {
      setAddress(item?.text);
      return;
    } else {
      if (!loading && coords) {
        setValue({
          [item?.field]: `${coords?.latitude},${coords?.longitude}`,
        });

        const fetchAddress = async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords?.latitude}&lon=${coords?.longitude}&format=json`,
              {
                headers: {
                  'User-Agent': 'MyReactNativeApp/1.0 (myemail@example.com)',
                },
              },
            );
            const data = await response.json();
            if (data?.address) {
              const { road, suburb, state, country, postcode } = data.address;
              const shortAddress = `${road || ''}, ${suburb || ''}, ${state || ''} - ${
                postcode || ''
              }, ${country || ''}`;
              setAddress(shortAddress.trim().replace(/^,|,$/g, ''));
              setValue({
                [item?.field]: shortAddress.trim().replace(/^,|,$/g, ''),
              });
            } else if (data?.display_name) {
              setAddress(data.display_name);
            }
          } catch (err) {
            console.warn('Failed to fetch address', err);
          }
        };

        fetchAddress();
      }
    }
  }, [coords, loading]);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>

      <View style={styles.disabledBox}>
        {item?.text !== '' && item?.text ? (
          <>
            <Text style={{ marginTop: 4, color: ERP_COLOR_CODE.ERP_333 }}>{item?.text}</Text>
          </>
        ) : (
          <>
            {' '}
            {loading ? (
              <Text style={{ color: ERP_COLOR_CODE.ERP_555 }}>Fetching...</Text>
            ) : (
              <>
                {address ? (
                  <Text style={{ marginTop: 4, color: ERP_COLOR_CODE.ERP_333 }}>{address}</Text>
                ) : (
                  <Text style={{ marginTop: 4, color: '#999' }}>Address not found</Text>
                )}
              </>
            )}{' '}
          </>
        )}
      </View>
    </View>
  );
};

export default LocationRow;
