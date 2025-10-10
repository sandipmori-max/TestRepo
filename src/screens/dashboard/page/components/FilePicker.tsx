import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import RNFS from 'react-native-fs';
import { Linking } from 'react-native';

interface FileType {
  name: string;
  uri: string;
  size?: number;
  type?: string;
}

const FilePickerRow = ({ item, handleAttachment, baseLink, infoData }) => {
  console.log('🚀 ~ FilePickerRow ~ item:', item);

  const base = `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${item?.text}`;
  console.log('🚀 ~ FilePickerRow ~ base:', base);

  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  const openFilePicker = async () => {
    try {
      const files = await pick({
        type: [types.allFiles],
      });
      setSelectedFiles(prev => [...prev, ...files]);

      let filePath = files[0].uri;

      if (Platform.OS === 'android' && files[0].uri.startsWith('content://')) {
        const destPath = `${RNFS.TemporaryDirectoryPath}/${files[0].name}`;
        await RNFS.copyFile(files[0].uri, destPath);
        filePath = destPath;
      }

      const fileBase64 = await RNFS.readFile(filePath, 'base64');

      handleAttachment(
        `${files[0].name}; data:${files[0].nativeType};base64,${fileBase64}`,
        item.field,
      );
    } catch (err: any) {
      if (err.code === 'USER_CANCELED') {
        console.log('User canceled picker');
      } else {
        console.warn('Picker error', err);
        Alert.alert('Error', 'Failed to pick file.');
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFile = async (index: number) => {
    try {
      const [file] = await pick({ type: [types.allFiles] });
      setSelectedFiles(prev => prev.map((f, i) => (i === index ? file : f)));
    } catch (err: any) {
      if (err.code === 'USER_CANCELED') return;
      Alert.alert('Error', 'Failed to update file.');
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return 'insert-drive-file';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'movie';
      case 'pdf':
        return 'picture-as-pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'grid-on';
      default:
        return 'insert-drive-file';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{item?.fieldtitle}</Text>
      {selectedFiles.length === 0 && (
        <>
          {item?.text !== '' && (
            <View style={{ marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  if (base) {
                    Linking.openURL(base).catch(err => console.error('Failed to open link:', err));
                  }
                }}
              >
                <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>{base}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <ScrollView showsHorizontalScrollIndicator={false}>
        {selectedFiles.map((file, index) => (
          <View key={index} style={styles.fileRow}>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons
                name={getFileIcon(file.name)}
                size={24}
                color={ERP_COLOR_CODE.ERP_555}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.updateBtn} onPress={() => updateFile(index)}>
                <MaterialIcons name="edit" size={18} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile(index)}>
                <MaterialIcons name="delete" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {selectedFiles.length === 0 && (
          <TouchableOpacity style={styles.addBtn} onPress={openFilePicker}>
            <MaterialIcons name="add" size={20} color={ERP_COLOR_CODE.ERP_WHITE} />
            <Text style={[styles.btnText, { marginLeft: 4 }]}>Select File</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default FilePickerRow;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  updateBtn: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  removeBtn: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  fileName: {
    maxWidth: 120,
    fontSize: 14,
    marginRight: 8,
  },
  btnText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontWeight: '600',
  },
});
