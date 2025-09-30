import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const statusColors: Record<string, string> = {
  pending: '#f39c12',
  in_progress: '#3498db',
  under_review: '#9b59b6',
  done: '#2ecc71',
};

const priorityColors: Record<string, string> = {
  Low: '#4caf50',
  Medium: '#ff9800',
  High: '#f44336',
};

const TaskDetailsBottomSheet = ({
  visible,
  task,
  role,
  onClose,
  onUpdate,
}: {
  visible: boolean;
  task: any;
  role: string;
  onClose: () => void;
  onUpdate: (updatedTask: any) => void;
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT * 0.2,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleAction = (newStatus: string) => {
    const updatedTask = { ...task, status: newStatus, updatedAt: new Date() };
    onUpdate?.(updatedTask);
  };

  const formatDate = (dateString: string | null) =>
    dateString ? new Date(dateString).toISOString().split('T')[0] : '—';

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={22} color={ERP_COLOR_CODE.ERP_333} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ marginTop: 10 }}>
          {/* Priority & Status */}
          <View style={styles.row}>
            {task.priority && (
              <View style={[styles.badge, { backgroundColor: priorityColors[task.priority] }]}>
                <Text style={styles.badgeText}>{task.priority}</Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: statusColors[task.status] }]}>
              <Text style={styles.badgeText}>{task.status.replace('_', ' ')}</Text>
            </View>
          </View>

          {/* Description */}
          {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}

          {/* Dates */}
          <View style={styles.row}>
            <MaterialIcons name="date-range" size={18} color="#555" />
            <Text style={styles.dateText}>
              {formatDate(task.startDate)} → {formatDate(task.endDate)}
            </Text>
          </View>

          {/* Assigned Developers */}
          {task.assignedTo?.length > 0 && (
            <View style={styles.row}>
              <MaterialIcons name="person" size={18} color="#555" />
              <Text style={styles.assignedText}>
                {task.assignedTo.length} developer(s) assigned
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {role === 'junior' && (
              <>
                {task.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#3498db' }]}
                    onPress={() => handleAction('in_progress')}
                  >
                    <Text style={styles.buttonText}>Start Work</Text>
                  </TouchableOpacity>
                )}
                {task.status === 'in_progress' && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#9b59b6' }]}
                    onPress={() => handleAction('under_review')}
                  >
                    <Text style={styles.buttonText}>Mark for Review</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {role === 'senior' && task.status === 'under_review' && (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#2ecc71' }]}
                  onPress={() => handleAction('done')}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#e74c3c' }]}
                  onPress={() => handleAction('query')}
                >
                  <Text style={styles.buttonText}>Send Query & Reassign</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.52,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: ERP_COLOR_CODE.ERP_333 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8, marginRight: 10 },
  badgeText: { color: ERP_COLOR_CODE.ERP_WHITE, fontSize: 13, fontWeight: '600' },
  desc: { fontSize: 16, color: '#555', marginBottom: 12 },
  dateText: { fontSize: 14, color: '#555', marginLeft: 6 },
  assignedText: { fontSize: 14, color: '#555', marginLeft: 6 },
  actions: { marginTop: 20 },
  button: { paddingVertical: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  buttonText: { color: ERP_COLOR_CODE.ERP_WHITE, fontWeight: '700', fontSize: 15 },
});

export default TaskDetailsBottomSheet;
