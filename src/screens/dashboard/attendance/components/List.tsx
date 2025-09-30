import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import NoData from '../../../../components/no_data/NoData';
import { PieChart } from 'react-native-gifted-charts';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useAppDispatch } from '../../../../store/hooks';
import { getERPListDataThunk } from '../../../../store/slices/auth/thunk';
import FullViewLoader from '../../../../components/loader/FullViewLoader';
import { useBaseLink } from '../../../../hooks/useBaseLink';
import { Calendar } from 'react-native-calendars';
import ErrorMessage from '../../../../components/error/Error';
import FastImage from 'react-native-fast-image';
import {
  formatTo12Hour,
  getWorkedHours,
  getWorkedHours2,
  isAfter830,
  isBefore830,
  isLatePunchIn,
  normalizeDate,
} from '../../../../utils/helpers';
import DetailsBottomSheet from './DetailsModal';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'leave', label: 'Leave' },
  { key: 'leave_first_half', label: 'First Half' },
  { key: 'leave_second_half', label: 'Second Half' },
  { key: 'late', label: 'Late Entry' },
  { key: 'after_830', label: '8:30 >' },
  { key: 'before_830', label: '8:30 <' },
];

const styles = StyleSheet.create({
  recordCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 4,
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    borderWidth: 0.5,
    width: '100%'
  },
  recordAvatar: { width: 50, height: 50, borderRadius: 25 },
  recordName: { fontSize: 14 },
  recordDateTime: { fontWeight: '600', fontSize: 14, color: ERP_COLOR_CODE.ERP_BLACK },
  recordPunchTime: { fontSize: 14, color: ERP_COLOR_CODE.ERP_333 },
  statusBadgeRed: {
    backgroundColor: ERP_COLOR_CODE.ERP_ERROR,
    color: ERP_COLOR_CODE.ERP_WHITE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusBadgeBlue: {
    backgroundColor: '#a6bfc9ff',
    color: ERP_COLOR_CODE.ERP_WHITE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusBadgeGrey: {
    backgroundColor: '#dad1d1',
    color: ERP_COLOR_CODE.ERP_BLACK,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

const List = ({ selectedMonth, showFilter, fromDate, toDate }: any) => {
  const dispatch = useAppDispatch();

  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const [parsedError, setParsedError] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'pie' | 'calendar'>('pie');

  const baseLink = useBaseLink();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20
      );
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        setCurrentView(prev => (prev === 'pie' ? 'calendar' : 'pie'));
      } else if (gestureState.dx > 50) {
        setCurrentView(prev => (prev === 'calendar' ? 'pie' : 'calendar'));
      }
    },
  });

  const fetchListData = useCallback(
    async (fromDateStr: string, toDateStr: string) => {
      try {
        setIsLoading(true);
        const raw = await dispatch(
          getERPListDataThunk({
            page: 'PunchIn',
            fromDate: fromDateStr,
            toDate: toDateStr,
            param: '',
          }),
        ).unwrap();
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const final = parsed?.d ? JSON.parse(parsed?.d) : parsed;
        setListData(final?.data || final || []);
      } catch (e: any) {
        setParsedError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (fromDate && toDate) fetchListData(fromDate, toDate);
  }, [fromDate, toDate, fetchListData]);

  let data = listData?.length > 0 ? [...listData] : [];
  console.log('🚀 ~ List ~ data:', data);
  if (activeFilter !== 'all') {
    switch (activeFilter) {
      case 'leave':
        data = data.filter(i => i?.status?.toLowerCase() === 'leave');
        break;
      case 'leave_first_half':
        data = data.filter(i => i?.status?.toLowerCase() === 'leave_first_half');
        break;
      case 'leave_second_half':
        data = data.filter(i => i?.status?.toLowerCase() === 'leave_second_half');
        break;
      case 'late':
        data = data.filter(i => i?.intime && isLatePunchIn(i?.intime));
        break;
      case 'after_830':
        data = data.filter(i => i?.intime && isAfter830(i?.intime));
        break;
      case 'before_830':
        data = data.filter(i => i?.intime && isBefore830(i?.intime));
        break;
    }
  }
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
  const timelineData = Object.keys(groupedData).map(date => ({
    date,
    records: groupedData[date],
  }));

  const total = listData?.length;
  const leave = listData?.filter(i => i?.status?.toLowerCase() === 'leave').length;
  const late = listData?.filter(i => i?.intime && isLatePunchIn(i?.intime)).length;
  const lessHours = listData?.filter(
    i => i?.intime && i?.outtime && getWorkedHours(i?.intime, i?.outtime) < 8.5,
  ).length;
  const present = total - leave;

  const chartData = [
    { value: present, color: '#4caf50', text: 'Present' },
    { value: leave, color: ERP_COLOR_CODE.ERP_ERROR, text: 'Leave' },
    { value: late, color: '#a6bfc9ff', text: 'Late' },
    { value: lessHours, color: '#ff9800', text: 'Less Hrs' },
  ];

  if (parsedError) {
    return (
      <View
        style={{
          height: Dimensions.get('screen').height * 0.75,
          alignContent: 'center',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ErrorMessage message={JSON.stringify(parsedError)} />
      </View>
    );
  }

  const markedDates =
    listData?.length > 0 &&
    listData?.reduce((acc, item) => {
      const dateStr = item?.date && normalizeDate(item?.date);
      let color = ERP_COLOR_CODE.ERP_APP_COLOR;

      if (item?.status?.toLowerCase() === 'leave') {
        color = ERP_COLOR_CODE.ERP_ERROR;
      } else if (
        item?.status?.toLowerCase() === 'leave_first_half' ||
        item?.status?.toLowerCase() === 'leave_second_half'
      ) {
        color = '#ff9800';
      } else if (item?.status?.toLowerCase() === 'working') {
        color = ERP_COLOR_CODE.ERP_BORDER_LINE;
      }

      acc[dateStr] = {
        selected: true,
        selectedColor: color,
        customStyles: {
          container: { backgroundColor: color, borderRadius: 6 },
          text: { color: ERP_COLOR_CODE.ERP_WHITE, fontWeight: '600' },
        },
      };

      return acc;
    }, {});

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}>
      {showFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          contentContainerStyle={{ alignItems: 'center', gap: 6 }}
        >
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter?.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 4, borderWidth: 1 },
                activeFilter === filter.key
                  ? { backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR, borderColor: ERP_COLOR_CODE.ERP_WHITE }
                  : { backgroundColor: ERP_COLOR_CODE.ERP_WHITE, borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE },
              ]}
            >
              <Text
                style={{ color: activeFilter === filter.key ? ERP_COLOR_CODE.ERP_WHITE : ERP_COLOR_CODE.ERP_BLACK, fontWeight: '600' }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {listData.length > 0 && (
        <FlatList
          data={['calendar']}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={() => (
            <>
              <View
                {...panResponder.panHandlers}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                {currentView === 'pie' && listData?.length > 0 && (
                  <View
                    style={{
                      justifyContent: 'space-around',
                      padding: 16,
                      alignItems: 'center',
                      flexDirection: 'row',
                      borderRadius: 8,
                    }}
                  >
                    <PieChart
                      data={chartData}
                      donut
                      radius={90}
                      innerRadius={80}
                      centerLabelComponent={() => (
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                          {total + `\n`}Days
                        </Text>
                      )}
                    />
                    <View style={{ marginTop: 12, gap: 12, marginHorizontal: 20 }}>
                      {chartData?.map((c, i) => (
                        <View
                          key={i}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                        >
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: c.color,
                            }}
                          />
                          <Text>{`${c?.text} (${c?.value})`}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {currentView === 'calendar' && (
                  <View style={{ marginTop: 12 }}>
                    <Calendar
                      style={{
                        width: Dimensions.get('window').width - 20,
                        alignSelf: 'center',
                        borderRadius: 8,
                        elevation: 2,
                      }}
                      monthFormat={'MMMM yyyy'}
                      hideExtraDays={false}
                      firstDay={1}
                      onDayPress={day => {
                        const selectedData = listData?.find(
                          d => normalizeDate(d?.date) === day?.dateString,
                        );
                        Alert.alert(
                          `Attendance on ${day?.dateString}`,
                          selectedData ? JSON.stringify(selectedData, null, 2) : 'No data',
                        );
                      }}
                      markingType={'custom'}
                      markedDates={markedDates}
                      theme={{
                        textDayFontWeight: '600',
                        todayTextColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                        arrowColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                      }}
                    />
                  </View>
                )}
              </View>

              {!isLoading && (
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginVertical: 10,
                      gap: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentView('pie');
                      }}
                      style={{
                        width: currentView === 'pie' ? 24 : 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor:
                          currentView === 'pie' ? ERP_COLOR_CODE.ERP_APP_COLOR : ERP_COLOR_CODE.ERP_BORDER_LINE,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentView('calendar');
                      }}
                      style={{
                        width: currentView === 'calendar' ? 24 : 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor:
                          currentView === 'calendar' ? ERP_COLOR_CODE.ERP_APP_COLOR : ERP_COLOR_CODE.ERP_BORDER_LINE,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* List */}
              {isLoading ? (
                <View
                  style={{
                    height: Dimensions.get('screen').height,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FullViewLoader />
                </View>
              ) : data.length === 0 ? (
                <View
                  style={{
                    height: Dimensions.get('screen').height * 0.45,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <NoData />
                </View>
              ) : (
                <View style={{marginHorizontal: 12}}>
                  <FlatList
                  data={timelineData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={{ marginBottom: 8 }}>
                       {/* <Text style={{ 
                        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        // opacity: 0.5,
                        color: ERP_COLOR_CODE.ERP_WHITE,
                        fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                        {item.date}
                      </Text> */}

                      {/* Timeline Records */}
                      {item.records.map((rec, idx) => {
                        const isLeaveFull = rec?.status?.toLowerCase() === 'leave';
                        const workedHours =
                          !rec?.intime || !rec?.outtime
                            ? 0
                            : getWorkedHours(rec?.intime, rec?.outtime);
                        const isLessThanRequired = !isLeaveFull && workedHours < 8.5;
                        const isLate = !isLeaveFull && rec?.intime && isLatePunchIn(rec?.intime);

                        return (
                          <View key={rec.id} style={{ flexDirection: 'row', marginBottom: 0 }}>
                            
                            <View style={{ alignItems: 'center', width: 8 }}>
                              <View
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                }}
                              />
                              {  (
                                <View
                                  style={{
                                    width: 2,
                                    flex: 1,
                                    backgroundColor: ERP_COLOR_CODE.ERP_BLACK
                                   }}
                                />
                              )}
                            </View>

                            <TouchableOpacity onPress={() => openDetails(rec)} style={{
                              right: 16,
                              flex: 1,
                               marginTop: 12,
                                }}>
                              <View
                                style={[
                                  styles.recordCard,
                                  
                                ]}
                              >
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                  {/* Images */}
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {rec?.image && (
                                      <FastImage
                                        source={{ uri: baseLink + '/' + rec?.image }}
                                        style={styles.recordAvatar}
                                      />
                                    )}
                                    {rec?.image2 && (
                                      <FastImage
                                        source={{ uri: baseLink + '/' + rec?.image2 }}
                                        style={[
                                          styles.recordAvatar,
                                          { marginLeft: -32, borderWidth: 2, borderColor: ERP_COLOR_CODE.ERP_WHITE },
                                        ]}
                                      />
                                    )}
                                  </View>

                                  {/* Details */}
                                  <View style={{ flex: 1, marginLeft: 12 }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 4,
                                      }}
                                    >
                                      <Text style={styles.recordName}>{rec?.employee}</Text>
                                      <Text style={styles.recordDateTime}>{rec?.date}</Text>
                                    </View>

                                    { (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 4,
                                          }}
                                        >
                                          <MaterialIcons
                                            color="#666"
                                            size={14}
                                            name="access-alarm"
                                          />
                                          <Text style={styles.recordPunchTime}>
                                            {formatTo12Hour(rec?.intime) || '--'}
                                          </Text>
                                        </View>

                                        {rec?.status?.toLowerCase() === 'working' ? (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              gap: 4,
                                            }}
                                          >
                                            <MaterialIcons
                                              color="#666"
                                              size={14}
                                              name="history-toggle-off"
                                            />
                                            <Text style={styles.recordPunchTime}>
                                              {rec?.status}
                                            </Text>
                                          </View>
                                        ) : (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              gap: 4,
                                            }}
                                          >
                                            <MaterialIcons color="#666" size={14} name="timeline" />
                                            <Text style={styles.recordPunchTime}>
                                              {getWorkedHours2(rec?.intime, rec?.outtime)}
                                            </Text>
                                          </View>
                                        )}

                                        {rec?.status?.toLowerCase() !== 'working' && (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              gap: 4,
                                            }}
                                          >
                                            <MaterialIcons
                                              color="#666"
                                              size={14}
                                              name="access-alarm"
                                            />
                                            <Text style={styles.recordPunchTime}>
                                              {formatTo12Hour(rec?.outtime) || '--'}
                                            </Text>
                                          </View>
                                        )}
                                      </View>
                                    )}

                                    {isLeaveFull && (
                                      <Text style={styles.statusBadgeRed}>Leave</Text>
                                    )}
                                    {isLate && <Text style={styles.statusBadgeBlue}>Late</Text>}
                                    {rec?.status?.toLowerCase() !== 'working' &&
                                      isLessThanRequired && (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <Text style={styles.statusBadgeGrey}>Less Hours</Text>
                                          <Text style={styles.statusBadgeGrey}>
                                            ({workedHours.toFixed(2)} hrs)
                                          </Text>
                                        </View>
                                      )}

                                    <View
                                      style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 4,
                                        marginTop: 4,
                                      }}
                                    >
                                      <MaterialIcons
                                        size={16}
                                        color={ERP_COLOR_CODE.ERP_ERROR}
                                        name="location-on"
                                      />
                                      <Text>{rec?.location || 'Dummy location'} </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}
                />
                </View>
              )}
            </>
          )}
        />
      )}

      <DetailsBottomSheet
        visible={showModal}
        onClose={closeDetails}
        item={selectedItem}
        baseLink={baseLink}
      />
    </View>
  );
};

export default List;
