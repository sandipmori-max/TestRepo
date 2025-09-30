import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { formatTo12Hour, getWorkedHours2 } from '../../../../utils/helpers';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FastImage from 'react-native-fast-image';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const { height } = Dimensions.get('screen');

const DetailsBottomSheet = ({ visible, onClose, item, baseLink }: any) => {
  const translateY = new Animated.Value(height);

  if (visible) {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <Animated.View
          style={{
            height: height * 0.65,
            backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            transform: [{ translateY }],
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end', padding: 6 }}>
            <MaterialIcons name="close" size={28} color={ERP_COLOR_CODE.ERP_333}/>
          </TouchableOpacity>

          {item ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                {item?.image && (
                  <FastImage
                    source={{ uri: baseLink + '/' + item?.image }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      borderWidth: 2,
                      borderColor: ERP_COLOR_CODE.ERP_WHITE,
                      backgroundColor: '#eee',
                    }}
                  />
                )}
                {item?.image2 && (
                  <FastImage
                    source={{ uri: baseLink + '/' + item?.image2 }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      borderWidth: 2,
                      borderColor: ERP_COLOR_CODE.ERP_WHITE,
                      backgroundColor: '#eee',
                      marginLeft: -20,
                    }}
                  />
                )}
              </View>

              <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 4 }}>
                {item?.employee}
              </Text>
              <Text style={{ fontSize: 14, textAlign: 'center', color: ERP_COLOR_CODE.ERP_666, marginBottom: 16 }}>
                {item?.status?.toUpperCase()}
              </Text>

              <View style={{ backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: ERP_COLOR_CODE.ERP_444 }}>Date</Text>
                  <Text style={{ fontWeight: '600' }}>{item?.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: ERP_COLOR_CODE.ERP_444 }}>In-Time</Text>
                  <Text style={{ fontWeight: '600' }}>{formatTo12Hour(item?.intime) || '--'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: ERP_COLOR_CODE.ERP_444 }}>Out-Time</Text>
                  <Text style={{ fontWeight: '600' }}>{formatTo12Hour(item?.outtime) || '--'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: ERP_COLOR_CODE.ERP_444 }}>Worked Hours</Text>
                  <Text style={{ fontWeight: '600' }}>
                    {getWorkedHours2(item?.intime, item?.outtime)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No details</Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DetailsBottomSheet;
