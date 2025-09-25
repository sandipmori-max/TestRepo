import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Animated,
  PanResponder,
  AppState,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import CustomAlert from '../../../../components/alert/CustomAlert';

const Media = ({ item, handleAttachment, infoData, baseLink, isFromNew }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const [loadingSmall, setLoadingSmall] = useState(false);
  const [loadingLarge, setLoadingLarge] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const [alertVisible, setAlertVisible] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslate = useRef({ x: 0, y: 0 });

  const pendingCameraAction = useRef(false);
  const appState = useRef(AppState.currentState);

  const getImageUri = (type: 'small' | 'large') => {
    const base =
      imageUri ||
      `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${
        type === 'small' ? `d_${item?.text}` : item?.text
      }`;
    return `${base}?cb=${cacheBuster}`;
  };

  // -------------------- Permissions --------------------
  const requestPermission = async (type: 'camera' | 'gallery'): Promise<boolean> => {
    try {
      const permission =
        type === 'camera'
          ? Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA
          : Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      let result = await check(permission);

      if (result === RESULTS.GRANTED) return true;

      if (result === RESULTS.DENIED) {
        result = await request(permission);
        if (result === RESULTS.GRANTED) return true;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        setAlertConfig({
          title: `${type === 'camera' ? 'Camera' : 'Gallery'} Permission Required`,
          message: `Please enable ${
            type === 'camera' ? 'camera' : 'gallery'
          } access from Settings to continue.`,
          type: 'error',
        });
        setModalClose(true);
        setIsSettingVisible(true);
        setAlertVisible(true);

        if (type === 'camera') pendingCameraAction.current = true; // Track if camera was pending

        return false;
      }

      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('⚠️ Permission error:', error);
      return false;
    }
  };

  // -------------------- AppState listener for settings resume --------------------
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      // if(!alertVisible){
      //   return
      // }
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        pendingCameraAction.current
      ) {
        const granted = await requestPermission('camera');
        if (granted) {
          setIsSettingVisible(false);
          setAlertVisible(false);
          pendingCameraAction.current = false;
          launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: true }, response => {
            if (response.assets && response.assets.length > 0) {
              const asset: Asset = response.assets[0];
              setImageUri(asset.uri || null);
              setCacheBuster(Date.now());
              handleAttachment(
                `${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`,
                item.field,
              );
            }
          });
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // -------------------- Render Media Options --------------------
  const renderMedia = () => {
    if (item?.ctltype === 'IMAGE') {
      return [
        {
          text: 'Camera',
          icon: 'photo-camera',
          onPress: async () => {
            const granted = await requestPermission('camera');
            if (!granted) return;

            launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: true }, response => {
              if (response.assets && response.assets.length > 0) {
                const asset: Asset = response.assets[0];
                setImageUri(asset.uri || null);
                setCacheBuster(Date.now());
                handleAttachment(
                  `${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`,
                  item.field,
                );
              }
            });
          },
        },
      ];
    } else {
      return [
        {
          text: 'Gallery',
          icon: 'photo-library',
          onPress: async () => {
            const granted = await requestPermission('gallery');
            if (!granted) return;
            launchImageLibrary(
              { mediaType: 'photo', quality: 0.8, includeBase64: true },
              response => {
                if (response.assets && response.assets.length > 0) {
                  const asset: Asset = response.assets[0];
                  setImageUri(asset.uri || null);
                  setCacheBuster(Date.now());
                  handleAttachment(
                    `${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`,
                    item.field,
                  );
                }
              },
            );
          },
        },
      ];
    }
  };

  const handleChooseImage = () => {
    setPickerModalVisible(true);
  };

  // -------------------- PanResponder & Zoom --------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        if (gesture.numberActiveTouches === 1) {
          translateX.setValue(lastTranslate.current.x + gesture.dx);
          translateY.setValue(lastTranslate.current.y + gesture.dy);
        } else if (gesture.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (!lastScale.currentDistance) lastScale.currentDistance = distance;
          const scaleFactor = distance / lastScale.currentDistance;
          scale.setValue(Math.max(1, Math.min(3, lastScale.current * scaleFactor)));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        lastTranslate.current.x += gesture.dx;
        lastTranslate.current.y += gesture.dy;
        lastScale.current = scale.__getValue();
        lastScale.currentDistance = undefined;
      },
    }),
  ).current;

  const zoomIn = () => {
    scale.setValue(Math.min(3, scale.__getValue() + 0.2));
    lastScale.current = scale.__getValue();
  };

  const zoomOut = () => {
    scale.setValue(Math.max(1, scale.__getValue() - 0.2));
    lastScale.current = scale.__getValue();
  };

  // -------------------- JSX --------------------
  return (
    <>
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>{item?.fieldtitle}</Text>
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={() => {
            if (isFromNew) return;
            setModalVisible(true);
          }}
        >
          <View style={{ width: 100, height: 100 }}>
            {loadingSmall && (
              <ActivityIndicator style={StyleSheet.absoluteFill} size="small" color="#000" />
            )}
            <Image
              key={item.field}
              source={imageUri ? { uri: imageUri } : { uri: getImageUri('small') }}
              style={styles.imageThumb}
              onLoadStart={() => !imageUri && setLoadingSmall(true)}
              onLoadEnd={() => setLoadingSmall(false)}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChooseImage} style={styles.editBtn}>
          <MaterialIcons name={'edit'} color={'#000'} size={20} />
        </TouchableOpacity>
      </View>

      {/* Fullscreen Image Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          scale.setValue(1);
          translateX.setValue(0);
          translateY.setValue(0);
          lastTranslate.current = { x: 0, y: 0 };
          lastScale.current = 1;
          setModalVisible(false);
        }}
      >
        <View style={styles.fullscreenModalOverlay}>
          <View style={styles.fullscreenModalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                scale.setValue(1);
                translateX.setValue(0);
                translateY.setValue(0);
                lastTranslate.current = { x: 0, y: 0 };
                lastScale.current = 1;
                setModalVisible(false);
              }}
            >
              <MaterialIcons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {loadingLarge && (
              <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#fff" />
            )}

            <Animated.View
              style={{
                width: '100%',
                height: '100%',
                transform: [{ scale }, { translateX }, { translateY }],
              }}
              {...panResponder.panHandlers}
            >
              <Image
                source={{ uri: getImageUri('large') }}
                style={styles.fullscreenImage}
                resizeMode="contain"
                onLoadStart={() => setLoadingLarge(true)}
                onLoadEnd={() => setLoadingLarge(false)}
              />
            </Animated.View>

            <View style={styles.zoomControls}>
              <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
                <MaterialIcons name="zoom-in" size={28} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
                <MaterialIcons name="zoom-out" size={28} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickerModalVisible}
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Image</Text>
              <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
              {renderMedia().map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionCard}
                  onPress={async () => {
                    setPickerModalVisible(false);
                    await option.onPress();
                  }}
                >
                  <MaterialIcons name={option?.icon} size={36} color="#000" />
                  <Text style={styles.optionLabel}>{option?.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert for permissions */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>{
          if(!modalClose){
           setAlertVisible(false)
          }
        }}
        isSettingVisible={isSettingVisible}
        actionLoader={undefined}
      />
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  imageThumb: {
    borderWidth: 1,
    width: 100,
    height: 100,
  },
  editBtn: {
    height: 36,
    width: 36,
    borderRadius: 36,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 28,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    left: Dimensions.get('screen').width / 1.88,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
    maxHeight: '60%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 12,
  },
  optionCard: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  optionLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenModalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
  },
  zoomBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Media;
