import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

const statusColors: Record<string, string> = {
  pending: '#f39c12',
  in_progress: '#3498db',
  under_review: '#9b59b6',
  done: '#2ecc71',
};

const TaskCard = ({ task, onPress }) => {
 
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.statusBar, { backgroundColor: statusColors[task.status] }]} />

      <View style={styles.content}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[task.status] }]}>
            <Text style={styles.statusText}>{task.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        {task.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons color={ERP_COLOR_CODE.ERP_666} size={14} name="hourglass-bottom" />
            <Text style={styles.date}>22 sep 2025</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons color={ERP_COLOR_CODE.ERP_666} size={14} name="hourglass-top" />
            <Text style={styles.date}>22 sep 2025</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.priorityChip]}>
            <Text style={styles.priorityText}>Low</Text>
          </View>

          {task.assignedTo?.length > 0 && (
            <Text style={styles.assigned}>👥 {task.assignedTo.length} dev(s)</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    overflow: 'hidden',
  },
  date: { fontSize: 12, color: ERP_COLOR_CODE.ERP_333 },
  statusBar: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  title: { fontSize: 14, fontWeight: '700', color: ERP_COLOR_CODE.ERP_333, marginBottom: 4 },
  desc: { fontSize: 12, color: ERP_COLOR_CODE.ERP_555, marginBottom: 6 },
  meta: { fontSize: 12, color: ERP_COLOR_CODE.ERP_777, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  priorityChip: {
    borderRadius: 8,
  },
  priorityText: { color: ERP_COLOR_CODE.ERP_BLACK, fontSize: 12, fontWeight: '400' },
  assigned: { fontSize: 12, color: ERP_COLOR_CODE.ERP_444 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: ERP_COLOR_CODE.ERP_WHITE },
});

export default TaskCard;
