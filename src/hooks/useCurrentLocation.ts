import { useEffect, useState, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

Geocoder.init("YOUR_GOOGLE_MAPS_API_KEY");

export const useCurrentAddress = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        try {
          const geo = await Geocoder.from(latitude, longitude);
          const area = geo.results[0].formatted_address;
          setAddress(area);
        } catch (err: any) {
          setError(err.message || 'Geocoding failed');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || 'Location error');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { address, coords, loading, error, refetch: fetchLocation };
};
