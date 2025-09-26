import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './display_style';
import ERPIcon from '../../../components/icon/ERPIcon';
import { useNavigation, useRoute } from '@react-navigation/native';
import CreateTaskScreen from '../../task_module/create_task/CreateTaskScreen';
import TaskListScreen from '../../task_module/task_list/TaskListScreen';
import TaskDetailsBottomSheet from '../../task_module/task_details/TaskDetailsScreen';

export const dummyTasks = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Check the API response and fix login issue',
    assignedTo: 'jr1',
    createdBy: 'senior1',
    status: 'pending',
    updatedAt: '2025-09-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Design dashboard UI',
    description: 'Create new dashboard screen for analytics',
    assignedTo: 'jr2',
    createdBy: 'senior1',
    status: 'in_progress',
    updatedAt: '2025-09-11T09:00:00Z',
  },
  {
    id: '3',
    title: 'API integration',
    description: 'Integrate attendance API',
    assignedTo: 'jr1',
    createdBy: 'senior2',
    status: 'under_review',
    updatedAt: '2025-09-12T08:30:00Z',
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Add Jest tests for user service',
    assignedTo: 'jr3',
    createdBy: 'senior1',
    status: 'done',
    updatedAt: '2025-09-09T15:00:00Z',
  },
  {
    id: '5',
    title: 'tests',
    description: 'Add Jest tests for user service',
    assignedTo: 'jr3',
    createdBy: 'senior1',
    status: '-',
    updatedAt: '2025-09-09T15:00:00Z',
  },
];

const DisplayScreen = () => {
  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const { isFromViewAll = false } = route.params || {};
  console.log('🚀 ~ DisplayScreen ~ isFromViewAll:', isFromViewAll);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isFromViewAll) {
      setIsListVisible(true);
    }
  }, [isFromViewAll]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isListVisible ? 'Tasks' : 'Create Task',
      headerRight: () => (
        <>
          <ERPIcon
            name={!isListVisible ? 'list' : 'post-add'}
            onPress={() => {
              if (showDetails) {
                return;
              }
              setIsListVisible(!isListVisible);
            }}
          />
          {isListVisible && (
            <ERPIcon
              name="filter-alt"
              onPress={() => {
                if (showDetails) {
                  return;
                }
                setShowFilter(!showFilter);
              }}
            />
          )}
          {isListVisible && (
            <ERPIcon
              name="date-range"
              onPress={() => {
                if (showDetails) {
                  return;
                }
                setShowPicker(!showPicker);
              }}
            />
          )}
          <ERPIcon name={isListVisible ? 'refresh' : 'save'} />
        </>
      ),
    });
  }, [navigation, isListVisible, showPicker, showFilter, showDetails]);

  return (
    <View style={styles.container}>
      {!isListVisible ? (
        <CreateTaskScreen onCreate={() => {}} />
      ) : (
        <TaskListScreen
          onSelectTask={task => {
            setSelectedTask(task);
            setModalVisible(true);
          }}
          tasks={dummyTasks}
          showFilter={showFilter}
          showPicker={showPicker}
        />
      )}

      {selectedTask && (
        <TaskDetailsBottomSheet
          visible={modalVisible}
          task={selectedTask}
          role="junior"
          onClose={() => setModalVisible(false)}
          onUpdate={updatedTask => {
            console.log('Updated Task:', updatedTask);
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default DisplayScreen;
