import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
            <MaterialIcons color="#666" size={14} name="hourglass-bottom" />
            <Text style={styles.date}>22 sep 2025</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons color="#666" size={14} name="hourglass-top" />
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
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  date: { fontSize: 12, color: '#333' },
  statusBar: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  title: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 4 },
  desc: { fontSize: 12, color: '#555', marginBottom: 6 },
  meta: { fontSize: 12, color: '#777', marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  priorityChip: {
    borderRadius: 8,
  },
  priorityText: { color: '#000', fontSize: 12, fontWeight: '400' },
  assigned: { fontSize: 12, color: '#444' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});

export default TaskCard;
