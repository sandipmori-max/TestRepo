import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../leave_style';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import BottomSheet from '../../../../components/bottomsheet/bottom_sheet';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

type LeaveRecord = {
  id: string;
  leaveType: string;
  days: number;
  from: string;
  to: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
};

type Props = {
  visible: boolean;
  leave?: LeaveRecord | null;
  onClose: () => void;
};

const getStatusColor = (status: LeaveRecord['status']) => {
  switch (status) {
    case 'Approved':
      return '#2e7d32';
    case 'Rejected':
      return '#c62828';
    default:
      return '#f9a825';
  }
};

const LeaveDetailsBottomSheet = ({ visible, leave, onClose }: Props) => {
  if (!leave) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} heightRatio={0.6}>
      <ScrollView>
        <View style={[styles.profileCard, ]}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {leave.leaveType} Leave
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: ERP_COLOR_CODE.ERP_666 }}>
            Days: {leave.days}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
            <MaterialIcons name="date-range" size={18} color={ERP_COLOR_CODE.ERP_444} />
            <Text style={{ marginLeft: 6 }}>
              {leave.from} → {leave.to}
            </Text>
          </View>

          <View
            style={{
              marginTop: 10,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: getStatusColor(leave.status) + '22',
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: getStatusColor(leave.status), fontWeight: '600' }}>
              {leave.status}
            </Text>
          </View>

          {leave.remarks ? (
            <Text style={{ marginTop: 10, fontSize: 14, color: ERP_COLOR_CODE.ERP_BLACK }}>
              Remarks: {leave.remarks}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            { marginTop: 20, backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR },
          ]}
          onPress={onClose}
        >
          <Text style={styles.submitText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomSheet>
  );
};

export default LeaveDetailsBottomSheet;
