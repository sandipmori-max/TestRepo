import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const BusinessCardView = ({ setValue, controls, item, baseLink, infoData }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [base64, setBase64] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [showPicker, setShowPicker] = useState(false);

  const getImageUri = (type: 'small' | 'large') => {
    const base =
      imageUri ||
      `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${
        type === 'small' ? `d_${item?.text}` : item?.text
      }`;
    return `${base}?cb=${cacheBuster}`;
  };

  const checkPermission = async (type: 'camera' | 'gallery') => {
    let permission;

    if (Platform.OS === 'ios') {
      permission = type === 'camera' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      const androidVersion = parseInt(Platform.Version as string, 10);

      if (type === 'camera') {
        permission = PERMISSIONS.ANDROID.CAMERA;
      } else {
        permission =
          androidVersion >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }

    const result = await check(permission);
    console.log('🚀 ~ checkPermission ~ result:', result);

    switch (result) {
      case RESULTS.GRANTED:
        return true;

      case RESULTS.DENIED: {
        const req = await request(permission);
        if (req === RESULTS.GRANTED) return true;

        Alert.alert(
          `${type === 'camera' ? 'Camera' : 'Gallery'} Permission Required`,
          `Please allow ${type === 'camera' ? 'camera' : 'gallery'} access to continue.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => openSettings() },
          ],
        );
        return false;
      }

      case RESULTS.BLOCKED:
        Alert.alert(
          `${type === 'camera' ? 'Camera' : 'Gallery'} Permission Blocked`,
          `Please enable ${type === 'camera' ? 'Camera' : 'Gallery'} access from Settings.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => openSettings() },
          ],
        );
        return false;

      case RESULTS.UNAVAILABLE:
        Alert.alert(
          'Feature Unavailable',
          `${type === 'camera' ? 'Camera' : 'Gallery'} permission is not available on this device.`,
        );
        return false;

      default:
        return false;
    }
  };

  const pickFromCamera = async () => {
    const granted = await checkPermission('camera');
    console.log('🚀 ~ pickFromCamera ~ granted:', granted);
    if (!granted) return;

    setShowPicker(false);
    const res = await launchCamera({ mediaType: 'photo', quality: 0.5, includeBase64: true });
    if (res.didCancel) return;
    if (res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      let uri = asset.uri!;
      if (Platform.OS === 'android' && !uri.startsWith('file://')) uri = 'file://' + uri;
      setCacheBuster(Date.now());
      setBase64(`${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`);
      setImageUri(uri);
    }
  };

  const pickFromGallery = async () => {
    const granted = await checkPermission('gallery');
    console.log('🚀 ~ pickFromGallery ~ granted:', granted);
    if (!granted) return;

    setShowPicker(false);
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.5, includeBase64: true });
    if (res.didCancel) return;
    if (res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      let uri = asset.uri!;
      if (Platform.OS === 'android' && !uri.startsWith('file://')) uri = 'file://' + uri;
      setCacheBuster(Date.now());
      setBase64(`${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`);
      setImageUri(uri);
    }
  };

  useEffect(() => {
    (async () => {
      if (!imageUri) return;
      setLoading(true);
      try {
        const result = await TextRecognition.recognize(imageUri);
        console.log('🚀 ~ BusinessCardView ~ +++++++++++++++result:', result);
        const joined = result.blocks.map(b => b.text).join(' ');
        console.log('🚀 ~ BusinessCardView ~ joined:*****************', joined);
        const p = parseCard(joined);
        console.log('🚀 ~ BusinessCardView ~ p//////////////////:', p);
        setValue(p);
      } catch (err) {
        console.error('OCR error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [imageUri]);

  const parseCard = (text: string): any => {
    const cleanedData = text.replace(/\s+/g, ' ').trim();

    const emails = [
      ...cleanedData.matchAll(/\b[A-Za-z0-9._%+-]+ *@ *[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g),
    ].map(e => e[0].replace(/\s+/g, ''));

    const phones = [...cleanedData.matchAll(/\+?\d{0,3}[-\s()]?\d{5}[-\s()]?\d{5}/g)].map(p =>
      p[0].replace(/\D+/g, ''),
    );
    const websites = [...cleanedData.matchAll(/\b(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g)].map(
      w => w[0],
    );

    const companyMatch = text.match(/^(.*?)(Development|Company)/i);
    const company = companyMatch ? companyMatch[1].trim().replace(/\s+$/, '') : '';

    const addressMatch = text.match(/Company\s+(.*?)Mobile:/is);
    const address = addressMatch ? addressMatch[1].trim().replace(/\s+/g, ' ') : '';

    const result = {
      name: '',
      emailid: emails[0] || '',
      emailid2: emails[1] || '',
      designation: '',
      mobileno: phones[0] || '',
      mobileno2: phones[1] || '',
      company,
      address,
      website: websites[0] || '',
      [item?.field]: base64,
      cardtext: text,
    };
    console.log('🚀 ~ parseCard ~ result:', result);
    setValue(result);
    return result;
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Business Card Reader</Text>

      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[
            styles.imageThumb,
            {
              position: 'relative',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ margin: 20 }} />
          ) : (
            <Image
              key={item.field}
              source={{ uri: imageUri ? imageUri : getImageUri('small') }}
              style={styles.imageThumb}
              resizeMode="cover"
            />
          )}

          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={18} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Image Source</Text>
            <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeIcon}>
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionRow}>
            <TouchableOpacity style={styles.optionCard} onPress={pickFromCamera}>
              <MaterialIcons name="photo-camera" size={40} color="#000" />
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard} onPress={pickFromGallery}>
              <MaterialIcons name="photo-library" size={40} color="#000" />
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  imageThumb: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    height: 180,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 2,
  },
  editIconContainer: {
    position: 'absolute',
    right: -10,
    top: '4%',
    transform: [{ translateY: -10 }],
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
  },
  sheetHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  closeIcon: { padding: 6, borderRadius: 30, backgroundColor: '#f2f2f2' },
  optionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  optionCard: {
    width: '42%',
    height: 110,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#333' },
});

export default BusinessCardView;
