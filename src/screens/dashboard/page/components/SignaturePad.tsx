import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useBaseLink } from '../../../../hooks/useBaseLink';

const SignaturePad: React.FC = ({ item, handleSignatureAttachment, infoData }: any) => {
  const signatureRef = useRef<SignatureViewRef>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  const baseLink = useBaseLink();
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const handleSignature = (signature: string) => {
    setSavedSignature(signature);
    handleSignatureAttachment(`${item?.field}.jpeg; ${signature}`, item?.field);
    setCacheBuster(Date.now());
    setModalVisible(false);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSavedSignature(null);
  };

  const handleSave = () => {
    signatureRef.current?.readSignature();
  };

  const getImageUri = () => {
    if (savedSignature) return savedSignature;
    const base = `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${item?.text}`;
    return `${base}?cb=${cacheBuster}`;
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginVertical: 8, fontWeight: '600' }}>{item?.fieldtitle}</Text>

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          padding: 4,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
        }}
      >
        <View>
        </View>
        <View style={{ height: 100, width: 100 }}>
          <Image source={{ uri: getImageUri() }} style={styles.imageThumb} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="edit" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sign below</Text>
            <View style={styles.buttonOverlay}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <MaterialIcons name="save" size={18} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
                <MaterialIcons name="auto-fix-high" size={18} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => Alert.alert('Please provide a signature')}
              descriptionText="Sign here"
              clearText="Clear"
              confirmText="Save"
              autoClear={false}
              dataURL={savedSignature || undefined}
              webStyle={`
                .m-signature-pad--footer {display: none; margin: 0;}
                .m-signature-pad {box-shadow: none; border: none;}
              `}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignaturePad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  imageThumb: {
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    height: 100,
    marginBottom: 12,
  },
  openButton: {
    flexDirection: 'row',
    width: '100%',
    height: 38,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderRadius: 8,
    justifyContent: 'center',
  },
  openButtonText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  savedSignatureContainer: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    height: Dimensions.get('window').height / 2.5,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  buttonOverlay: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  saveButton: { borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE, borderWidth: 1 },
  clearButton: { borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE, borderWidth: 1 },
  closeButton: { borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE, borderWidth: 1 },
});
