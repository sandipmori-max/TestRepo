import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TaskCard from './TaskCard';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const statusOptions = ['all', 'pending', 'in_progress', 'under_review', 'done'];
const priorityOptions = ['all', 'Low', 'Medium', 'High'];

const TaskListScreen = ({ tasks, onSelectTask, showPicker, showFilter }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const [dateFilter, setDateFilter] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [dateMode, setDateMode] = useState<'start' | 'end'>('start');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (
        search.trim() &&
        !task.assignedTo.some((dev: string) => dev.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false;
      }
      if (status !== 'all' && task.status !== status) return false;
      if (priority !== 'all' && task.priority !== priority) return false;
      const taskDate = task.startDate ? new Date(task.startDate) : null;
      if (dateFilter.start && taskDate && taskDate < dateFilter.start) {
        return false;
      }
      if (dateFilter.end && taskDate && taskDate > dateFilter.end) {
        return false;
      }

      return true;
    });
  }, [tasks, search, status, priority, dateFilter]);

  const showDatePicker = (mode: 'start' | 'end') => {
    setDateMode(mode);
    setDatePickerVisible(true);
  };

  const handleConfirmDate = (date: Date) => {
    setDateFilter(prev => ({ ...prev, [dateMode]: date }));
    setDatePickerVisible(false);
  };

  const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : 'Select');

  return (
    <FlatList
      data={['']}
      keyboardShouldPersistTaps="handled"
      renderItem={() => {
        return (
          <View style={styles.container}>
            {showFilter && (
              <View style={styles.filterCard}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search developer..."
                  value={search}
                  // onChangeText={setSearch}
                />

                <Text style={{ marginBottom: 4, fontSize: 12 }}>Status</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <View style={styles.filterRow}>
                    {statusOptions.map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.chip,
                          status === s && { backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR },
                        ]}
                        onPress={() => setStatus(s)}
                      >
                        <Text style={[styles.chipText, status === s && { color: ERP_COLOR_CODE.ERP_WHITE }]}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text style={{ marginBottom: 4, fontSize: 12 }}>Priority</Text>

                <View style={styles.filterRow}>
                  {priorityOptions.map(p => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.chip,
                        priority === p && { backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR },
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Text style={[styles.chipText, priority === p && { color: ERP_COLOR_CODE.ERP_WHITE }]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {showPicker && (
              <View style={styles.dateRow}>
                <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('start')}>
                  <MaterialIcons name="date-range" size={18} color={ERP_COLOR_CODE.ERP_555} />
                  <Text style={styles.dateText}>Start: {formatDate(dateFilter.start)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('end')}>
                  <MaterialIcons name="event" size={18} color={ERP_COLOR_CODE.ERP_555} />
                  <Text style={styles.dateText}>End: {formatDate(dateFilter.end)}</Text>
                </TouchableOpacity>
              </View>
            )}

            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={() => setDatePickerVisible(false)}
            />

            {filteredTasks.length === 0 ? (
              <Text style={styles.noTask}>No tasks found</Text>
            ) : (
              <FlatList
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                data={filteredTasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TaskCard task={item} onPress={() => onSelectTask(item)} />
                )}
              />
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE },
  filterCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    margin: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_ddd,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    backgroundColor: ERP_COLOR_CODE.ERP_fafafa,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: ERP_COLOR_CODE.ERP_eee,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: { fontSize: 12, color: ERP_COLOR_CODE.ERP_333 },

  dateRow: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 4,
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_fafafa,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_ddd,
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  dateText: { marginLeft: 6, fontSize: 13, color: ERP_COLOR_CODE.ERP_333 },

  noTask: { textAlign: 'center', marginTop: 40, fontSize: 16, color: ERP_COLOR_CODE.ERP_888 },
});

export default TaskListScreen;
