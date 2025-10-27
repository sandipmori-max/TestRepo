import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../page_style';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useCurrentAddress } from '../../../../hooks/useCurrentLocation';

const LocationRow = ({ isValidate, item, value, setValue }: any) => {
  const { coords, loading } = useCurrentAddress();
  const [address, setAddress] = useState<string>('');
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState(false);

  useEffect(() => {
    if (item?.text !== '' && item?.text !== '#location') {
      setAddress(item?.text);
      return;
    }

    if (!loading && coords) {
      setValue({
        [item?.field]: `${coords?.latitude},${coords?.longitude}`,
      });

      let retryCount = 0;
      const maxRetries = 3;
      const retryDelay = 3000;

      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords?.latitude}&lon=${coords?.longitude}&format=json`,
            {
              headers: {
                'User-Agent': 'MyReactNativeApp/1.0 (myemail@example.com)',
              },
            }
          );

          const data = await response.json();
          console.log('🚀 ~ fetchAddress ~ data:', data);

          if (data?.address) {
            const { road, suburb, state, country, postcode } = data.address;
            const shortAddress = `${road || ''}, ${suburb || ''}, ${state || ''} - ${postcode || ''}, ${country || ''}`;
            const trimmedAddress = shortAddress.trim().replace(/^,|,$/g, '');

            setAddress(trimmedAddress);
            setRetryError(false);
            // setValue({
            //   [item?.field]: trimmedAddress,
            // });
          } else if (data?.display_name) {
            setAddress(data.display_name);
            setRetryError(false);
          }
        } catch (err) {
          console.warn(`Fetch attempt ${retryCount + 1} failed`, err);

          if (retryCount < maxRetries - 1) {
            retryCount++;
            setTimeout(fetchAddress, retryDelay);
          } else {
            setRetryError(true);
            console.error('Failed to fetch address after retries:', err);
          }
        }
      };

      fetchAddress();
    }
  }, [coords, loading]);

  const handleManualRetry = async () => {
    if (!coords) return;
    setRetrying(true);
    setRetryError(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords?.latitude}&lon=${coords?.longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'MyReactNativeApp/1.0 (myemail@example.com)',
          },
        }
      );

      const data = await response.json();
      if (data?.address) {
        const { road, suburb, state, country, postcode } = data.address;
        const shortAddress = `${road || ''}, ${suburb || ''}, ${state || ''} - ${postcode || ''}, ${country || ''}`;
        const trimmedAddress = shortAddress.trim().replace(/^,|,$/g, '');
        setAddress(trimmedAddress);
        // setValue({
        //   [item?.field]: trimmedAddress,
        // });
        setRetryError(false);
      } else if (data?.display_name) {
        setAddress(data.display_name);
        setRetryError(false);
      } else {
        setRetryError(true);
      }
    } catch (err) {
      console.error('Manual retry failed:', err);
      setRetryError(true);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Field Label Row */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.label}>{item?.fieldtitle}</Text>
        {item?.fieldtitle !== item?.tooltip && <Text> - ( {item?.tooltip} )</Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>

      {/* Address / Loading / Error */}
      <View style={styles.disabledBox}>
        {item?.text !== '' && item?.text && item?.text !== '#location' ? (
          <Text style={{ marginTop: 4, color: ERP_COLOR_CODE.ERP_333 }}>{item?.text}</Text>
        ) : loading ? (
          <Text style={{ color: ERP_COLOR_CODE.ERP_555 }}>Fetching current location...</Text>
        ) : address ? (
          <Text style={{ marginTop: 4, color: ERP_COLOR_CODE.ERP_333 }}>{address}</Text>
        ) : retryError ? (
          <>
            <Text style={{ marginTop: 4, color: '#999' }}>Failed to fetch address.</Text>
            <TouchableOpacity onPress={handleManualRetry} disabled={retrying}>
              <Text style={{ color: 'blue', marginTop: 4 }}>
                {retrying ? 'Retrying...' : 'Tap to retry'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ marginTop: 4, color: '#999' }}>Address not found</Text>
        )}
      </View>
    </View>
  );
};

export default LocationRow;