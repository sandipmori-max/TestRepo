import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { styles } from './attendance_style';
import FullViewLoader from '../../../components/loader/FullViewLoader';
import ERPIcon from '../../../components/icon/ERPIcon';
import List from './components/List';
import AttendanceForm from './components/AttendanceForm';
import { useAppDispatch } from '../../../store/hooks';
import { getLastPunchInThunk } from '../../../store/slices/attendance/thunk';
import ErrorMessage from '../../../components/error/Error';
import { formatDateForAPI, parseCustomDate } from '../../../utils/helpers';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const AttendanceScreen = () => {
  const navigation = useNavigation<any>();
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const [resData, setResData] = useState<any>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [blockAction, setBlockAction] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [error, setError] = useState<any>('');

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<null | {
    type: 'from' | 'to';
    show: boolean;
  }>(null);

  const getCurrentMonthRange = useCallback(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date();
    const fromDateStr = formatDateForAPI(firstDay);
    const toDateStr = formatDateForAPI(lastDay);
    setFromDate(fromDateStr);
    setToDate(toDateStr);
    return { fromDate: fromDateStr, toDate: toDateStr };
  }, []);

  const formattedMonth = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;

  const onChangeDate = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left', 
      headerRight: () => (
        <>
          <ERPIcon
            name={!isListVisible ? 'list' : 'post-add'}
            onPress={() => {
              if (!blockAction) {
                setIsListVisible(!isListVisible);
              }
            }}
          />
          {isListVisible && (
            <ERPIcon
              name="filter-alt"
              onPress={() => {
                if (!blockAction) {
                  setShowFilter(!showFilter);
                }
              }}
            />
          )}
          {isListVisible && (
            <ERPIcon
              name="date-range"
              onPress={() => {
                setShowDateFilter(!showDateFilter);
              }}
            />
          )}
          <ERPIcon
            isLoading={actionLoader}
            name="refresh"
            onPress={() => {
              setRefresh(!refresh);
              setActionLoader(!actionLoader);
            }}
          />
        </>
      ),
    });
  }, [
    navigation,
    isListVisible,
    showPicker,
    showFilter,
    blockAction,
    refresh,
    actionLoader,
    showDateFilter,
  ]);

  const checkAttendance = () => {
    setIsLoading(true);
    dispatch(getLastPunchInThunk())
      .unwrap()
      .then(res => {
        setResData(res);
        setIsLoading(false);
        setActionLoader(false);
        setError(null);
      })
      .catch(err => {
        setIsLoading(false);
        setActionLoader(false);
        setError(err);
      });
  };
  useEffect(() => {
    getCurrentMonthRange();
    checkAttendance();
  }, [refresh]);

  if (error && error !== '') {
    <ErrorMessage message={error} />;
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setShowDatePicker(null);
      return;
    }
    const { type } = showDatePicker!;
    const formattedDate = formatDateForAPI(selectedDate);

    if (type === 'to') {
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (fromDate) {
        const fromDateObj = new Date(fromDate.split('-').reverse().join('-'));
        if (selectedDate < fromDateObj) {
          Alert.alert('Invalid Date Range', 'To date cannot be before From date.', [
            { text: 'OK' },
          ]);
          setShowDatePicker(null);
          return;
        }
      }
      setToDate(formattedDate);
    } else {
      setFromDate(formattedDate);
      if (toDate) {
        const toDateObj = new Date(toDate.split('-').reverse().join('-'));
        if (selectedDate > toDateObj) {
          setToDate('');
        }
      }
    }
    setShowDatePicker(null);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('screen').height * 0.85,
            }}
          >
            <FullViewLoader />
          </View>
        ) : (
          <>
            {isListVisible && showDateFilter && (
              <View style={styles.dateContainer}>
                <View style={styles.dateRow}>
                   
                  <TouchableOpacity
                    onPress={() => setShowDatePicker({ type: 'from', show: true })}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateButtonText}>{fromDate || 'Select From Date'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dateRow}>
                   
                  <TouchableOpacity
                    onPress={() => setShowDatePicker({ type: 'to', show: true })}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateButtonText}>{toDate || 'Select To Date'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {showDatePicker?.show && (
              <DateTimePicker
                value={
                  showDatePicker?.type === 'from' && fromDate
                    ? parseCustomDate(fromDate)
                    : showDatePicker?.type === 'to' && toDate
                    ? parseCustomDate(toDate)
                    : new Date()
                }
                mode="date"
                onChange={handleDateChange}
                minimumDate={
                  showDatePicker?.type === 'to' && fromDate
                    ? parseCustomDate(fromDate)
                    : new Date(new Date().getFullYear(), 0, 1)
                }
                maximumDate={
                  showDatePicker?.type === 'from' && toDate ? parseCustomDate(toDate) : new Date()
                }
              />
            )}
            {isListVisible ? (
              <View style={{ flex: 1 }}>
                <List
                  selectedMonth={formattedMonth}
                  showFilter={showFilter}
                  fromDate={fromDate}
                  toDate={toDate}
                />

                {showPicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeDate}
                  />
                )}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                 }}
              >
                <AttendanceForm setBlockAction={setBlockAction} resData={resData} />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default AttendanceScreen;
