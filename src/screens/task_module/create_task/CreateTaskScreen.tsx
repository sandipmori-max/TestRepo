import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const dummyUsers = [
  { id: 'jr1', name: 'Junior Dev 1' },
  { id: 'jr2', name: 'Junior Dev 2' },
  { id: 'jr3', name: 'Junior Dev 3' },
];

const CreateTaskScreen = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);

  // dates
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [dateMode, setDateMode] = useState<'start' | 'end'>('start');

  // priority
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | null>(null);

  const toggleUser = (id: string) => {
    if (assignedTo.includes(id)) {
      setAssignedTo(assignedTo.filter(u => u !== id));
    } else {
      setAssignedTo([...assignedTo, id]);
    }
  };

  const showDatePicker = (mode: 'start' | 'end') => {
    setDateMode(mode);
    setDatePickerVisible(true);
  };

  const handleConfirmDate = (date: Date) => {
    if (dateMode === 'start') setStartDate(date);
    else setEndDate(date);
    setDatePickerVisible(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleCreate = () => {
    if (!title.trim() || assignedTo.length === 0) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      description: desc,
      assignedTo,
      priority,
      createdBy: 'senior1',
      status: 'pending',
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    onCreate?.(newTask);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* === Task Info === */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Task Info</Text>

        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder="Enter description"
          value={desc}
          multiline
          onChangeText={setDesc}
        />
      </View>

      {/* === Assign To === */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assignment</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
          <Text style={{ flex: 1, color: assignedTo.length > 0 ? ERP_COLOR_CODE.ERP_BLACK : '#999' }}>
            {assignedTo.length > 0 ? `Assigned: ${assignedTo.length} dev(s)` : 'Select Developers'}
          </Text>
          <MaterialIcons name="person-add" size={22} color={ERP_COLOR_CODE.ERP_555} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal visible={dropdownVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Developers</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <MaterialIcons name="close" size={22} color={ERP_COLOR_CODE.ERP_333} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubText}>Choose one or more juniors to assign this task.</Text>

            {/* Options */}
            <FlatList
              data={dummyUsers}
              keyboardShouldPersistTaps="handled"
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => toggleUser(item.id)}>
                  <Text style={{ flex: 1 }}>{item.name}</Text>
                  <MaterialIcons
                    name={assignedTo.includes(item.id) ? 'check-box' : 'check-box-outline-blank'}
                    size={22}
                    color={ERP_COLOR_CODE.ERP_APP_COLOR}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* === Dates === */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Timeline</Text>

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('start')}>
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          <MaterialIcons name="date-range" size={20} color={ERP_COLOR_CODE.ERP_555}/>
        </TouchableOpacity>

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('end')}>
          <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          <MaterialIcons name="event" size={20} color={ERP_COLOR_CODE.ERP_555} />
        </TouchableOpacity>
      </View>

      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.priorityContainer}>
          {['Low', 'Medium', 'High'].map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.priorityChip, priority === p && styles.priorityChipActive(p)]}
              onPress={() => setPriority(p as 'Low' | 'Medium' | 'High')}
            >
              <Text style={[styles.priorityText, priority === p && { color: ERP_COLOR_CODE.ERP_WHITE }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE, padding: 16 },

  card: {
    borderRadius: 12,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    paddingVertical: 4,
    paddingLeft: 8,
    marginBottom: 4,
    color: ERP_COLOR_CODE.ERP_333,
  },

  label: { fontSize: 13, marginTop: 6, marginBottom: 4, color: ERP_COLOR_CODE.ERP_666 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fafafa',
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: ERP_COLOR_CODE.ERP_333 },
  modalSubText: { fontSize: 13, color: ERP_COLOR_CODE.ERP_666, marginBottom: 12 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  dateText: { color: ERP_COLOR_CODE.ERP_333 },

  priorityContainer: { flexDirection: 'row', marginTop: 8 },
  priorityChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#fafafa',
  },
  priorityChipActive: (p: string) => ({
    backgroundColor: p === 'Low' ? '#4caf50' : p === 'Medium' ? '#ff9800' : '#f44336',
    borderColor: 'transparent',
  }),
  priorityText: { fontSize: 13, fontWeight: '600', color: ERP_COLOR_CODE.ERP_333 },

  createButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createText: { color: ERP_COLOR_CODE.ERP_WHITE, fontSize: 16, fontWeight: 'bold' },
});
