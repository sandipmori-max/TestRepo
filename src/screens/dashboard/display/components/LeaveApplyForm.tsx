import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomAlert from '../../../../components/alert/CustomAlert';
import { styles } from '../leave_style';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

export type LeaveEntry = {
  date: string;
  type: 'Full' | 'First Half' | 'Second Half';
};

const LeaveApplyForm = () => {
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const leaveBalances = {
    Casual: 3,
    Sick: 5,
    Paid: 10,
    'Un-Paid': 999,
  } as const;

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const initialValues = {
    name: 'John Doe',
    email: 'john@example.com',
    leaveType: 'Casual',
    remarks: '',
    days: [] as LeaveEntry[],
  };

  const validationSchema = Yup.object({
    leaveType: Yup.string().required('Leave type is required'),
    days: Yup.array().min(1, 'At least one leave day is required'),
  });

  const calculateTotalLeave = (days: LeaveEntry[]) =>
    days.reduce((total, d) => total + (d.type === 'Full' ? 1 : 0.5), 0);

  const toYMD = (iso: string | Date) => {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return d.toISOString().split('T')[0];
  };

  const sameDay = (a: string, b: string) => toYMD(a) === toYMD(b);
  const isWeekend = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };

  const isHoliday = (_date: Date) => {
    return false;
  };

  const isHolidayOrWeekend = (date: Date) => isWeekend(date) || isHoliday(date);

  const applySandwichRule = (days: LeaveEntry[]): LeaveEntry[] => {
    if (days.length < 2) return days;

    const sorted = [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const expanded: LeaveEntry[] = [...sorted];

    for (let i = 0; i < sorted.length - 1; i++) {
      const start = sorted[i];
      const end = sorted[i + 1];

      const startDate = new Date(start.date);
      const endDate = new Date(end.date);

      if (toYMD(startDate) === toYMD(endDate) || startDate >= endDate) continue;

      if (start.type !== 'Full' || end.type !== 'Full') continue;

      let cursor = new Date(startDate);
      cursor.setDate(cursor.getDate() + 1);

      let gapHasOnlyHolidays = true;
      while (cursor < endDate) {
        if (!isHolidayOrWeekend(cursor)) {
          gapHasOnlyHolidays = false;
          break;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      if (gapHasOnlyHolidays) {
        let fill = new Date(startDate);
        fill.setDate(fill.getDate() + 1);
        while (fill < endDate) {
          const iso = fill.toISOString();
          const ymd = toYMD(fill);
          if (!expanded.some(d => toYMD(d.date) === ymd)) {
            expanded.push({ date: iso, type: 'Full' });
          }
          fill.setDate(fill.getDate() + 1);
        }
      }
    }

    return expanded.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleSubmitForm = (values: typeof initialValues) => {
    const finalDays = applySandwichRule(values.days);
    const totalLeave = calculateTotalLeave(finalDays);

    const balance = leaveBalances[values.leaveType as keyof typeof leaveBalances] ?? 0;

    if (values.leaveType === 'Casual' && totalLeave > balance) {
      const extraDays = totalLeave - balance;

      setAlertConfig({
        title: 'Leave Adjustment (Sandwich Applied)',
        message:
          `Requested: ${totalLeave} day(s) including sandwich days.\n` +
          `Available Casual: ${balance} day(s).\n` +
          `Excess ${extraDays} day(s) will be adjusted as Un-Paid.`,
        type: 'info',
      });
      setAlertVisible(true);

      const finalPayload = {
        ...values,
        days: finalDays,
        appliedDays: totalLeave,
        allocation: {
          Casual: balance,
          'Un-Paid': extraDays,
        },
      };

      console.log('Payload (with sandwich):', finalPayload);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlertConfig({
        title: 'Success',
        message: `Leave submitted!\nTotal Days (with sandwich): ${totalLeave}`,
        type: 'success',
      });
      setAlertVisible(true);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
          const previewDays = applySandwichRule(values.days);
          const previewTotal = calculateTotalLeave(previewDays);
          const autoCounted = previewDays.filter(
            d => !values.days.some(u => sameDay(u.date, d.date)),
          );

          return (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.profileCard}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Employee Name</Text>
                  <TextInput
                    style={[styles.input, styles.inputReadonly]}
                    value={values.name}
                    editable={false}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.inputReadonly]}
                    value={values.email}
                    editable={false}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Leave Type</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {Object.keys(leaveBalances).map(type => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setFieldValue('leaveType', type)}
                        style={[
                          styles.optionBtn,
                          values.leaveType === type && styles.optionBtnSelected,
                          { width: '23%' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            values.leaveType === type && styles.optionTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.leaveType && errors.leaveType && (
                    <Text style={styles.errorText}>{errors.leaveType as string}</Text>
                  )}
                  <Text style={{ marginTop: 5, fontSize: 12, color: '#555' }}>
                    Balance: {leaveBalances[values.leaveType as keyof typeof leaveBalances]} days
                  </Text>
                </View>

                <View className="formGroup" style={styles.formGroup}>
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <Text style={[styles.label, { marginBottom: 0 }]}>Leave Days</Text>
                    <TouchableOpacity
                      style={[
                        touched.days &&
                          errors.days && {
                            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                            borderRadius: 4,
                            padding: 4,
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                      ]}
                      onPress={() => setDatePickerVisible(true)}
                    >
                      <MaterialIcons
                        name={'data-saver-on'}
                        color={touched.days && errors.days ? ERP_COLOR_CODE.ERP_WHITE : '#747070ff'}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                  {values.days.length > 0 ? (
                    values.days.map((day, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ flex: 1 }}>{new Date(day.date).toLocaleDateString()}</Text>
                        <View
                          style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-around' }}
                        >
                          {['Full', 'First Half', 'Second Half'].map(option => (
                            <TouchableOpacity
                              key={option}
                              onPress={() => {
                                const newDays = [...values.days];
                                newDays[index].type = option as LeaveEntry['type'];
                                setFieldValue('days', newDays);
                              }}
                              style={[
                                styles.optionBtn,
                                day.type === option && styles.optionBtnSelected,
                                { paddingHorizontal: 8 },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.optionText,
                                  day.type === option && styles.optionTextSelected,
                                ]}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const newDays = values.days.filter((_, i) => i !== index);
                            setFieldValue('days', newDays);
                          }}
                          style={{ marginLeft: 10 }}
                        >
                          <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: '#999' }}>No days added yet</Text>
                  )}

                  {touched.days && errors.days && (
                    <Text style={styles.errorText}>{errors.days as string}</Text>
                  )}
                </View>

                <View style={{ marginVertical: 12, backgroundColor: ERP_COLOR_CODE.ERP_WHITE, borderRadius: 8 }}>
                  <Text style={{ fontWeight: '600' }}>Preview (with Sandwich Rule):</Text>
                  <Text style={{ marginTop: 4 }}>Total Days Counted: {previewTotal}</Text>
                  {autoCounted.length > 0 && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ fontSize: 12, color: '#690707ff' }}>
                        Auto-counted due to Sandwich Rule:
                      </Text>
                      <Text style={{ fontSize: 12, color: '#690707ff', marginTop: 2 }}>
                        {autoCounted.map(d => new Date(d.date).toLocaleDateString()).join(', ')}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Remarks</Text>
                  <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    value={values.remarks}
                    onChangeText={text => setFieldValue('remarks', text)}
                    placeholder="Enter remarks"
                    multiline
                  />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()}>
                  <Text style={styles.submitText}>Submit Leave</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={date => {
                  const ymd = toYMD(date);
                  const exists = values.days.some(d => toYMD(d.date) === ymd);

                  if (date.getDay() === 0) {
                    setAlertConfig({
                      title: 'Sunday not selectable',
                      message:
                        'Sundays are auto-counted when sandwiched between leave days. Please select working days around it instead.',
                      type: 'error',
                    });
                    setAlertVisible(true);
                    setDatePickerVisible(false);
                    return;
                  }

                  if (exists) {
                    setAlertConfig({
                      title: 'Duplicate Date',
                      message: `${new Date(date).toLocaleDateString()} is already selected.`,
                      type: 'error',
                    });
                    setAlertVisible(true);
                  } else {
                    setFieldValue('days', [
                      ...values.days,
                      { date: date.toISOString(), type: 'Full' },
                    ]);
                  }

                  setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
              />
            </ScrollView>
          );
        }}
      </Formik>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#673AB7" />
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default LeaveApplyForm;
