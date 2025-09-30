import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import NoData from '../../../../components/no_data/NoData';
import { PieChart } from 'react-native-gifted-charts';
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

const TABS: ('All' | 'Pending' | 'Approved' | 'Rejected')[] = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
];

const LeaveListPage = ({ showFilter, onSelect }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [data, setData] = useState<LeaveRecord[]>([]);

  useEffect(() => {
    setData([
      {
        id: '1',
        leaveType: 'Casual',
        days: 2,
        from: '2025-01-15',
        to: '2025-01-16',
        status: 'Approved',
        remarks: 'Family function',
      },
      {
        id: '2',
        leaveType: 'Sick',
        days: 1,
        from: '2025-02-05',
        to: '2025-02-05',
        status: 'Pending',
        remarks: 'Fever',
      },
      {
        id: '3',
        leaveType: 'Paid',
        days: 5,
        from: '2025-02-10',
        to: '2025-02-14',
        status: 'Rejected',
        remarks: 'Project deadline',
      },
      {
        id: '4',
        leaveType: 'Casual',
        days: 3,
        from: '2025-03-20',
        to: '2025-03-22',
        status: 'Approved',
        remarks: 'Vacation trip',
      },
      {
        id: '5',
        leaveType: 'Sick',
        days: 2,
        from: '2025-03-25',
        to: '2025-03-26',
        status: 'Approved',
        remarks: 'Flu',
      },
      {
        id: '6',
        leaveType: 'Paid',
        days: 1,
        from: '2025-04-02',
        to: '2025-04-02',
        status: 'Pending',
        remarks: 'Festival holiday',
      },
    ]);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

  const groupByMonth = (records: LeaveRecord[]) => {
    const grouped: { [month: string]: LeaveRecord[] } = {};
    records.forEach(item => {
      const monthKey = new Date(item.from).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(item);
    });

    return Object.keys(grouped).map(month => ({
      title: month,
      data: grouped[month],
    }));
  };

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      item.remarks?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const sections = groupByMonth(filteredData);
  const getSummaryData = () => {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };

    data.forEach(item => {
      counts[item.status]++;
    });

    return [
      { value: counts.Approved, color: '#2e7d32', text: 'Approved' },
      { value: counts.Pending, color: '#f9a825', text: 'Pending' },
      { value: counts.Rejected, color: '#c62828', text: 'Rejected' },
    ];
  };

  const renderItem = ({ item }: { item: LeaveRecord }) => (
    <TouchableOpacity
      onPress={() => onSelect?.(item)}
      style={{
        backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
        marginVertical: 6,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
        borderLeftWidth: 6,
        borderLeftColor: getStatusColor(item.status),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: getStatusColor(item.status) + '22',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: getStatusColor(item.status),
            }}
          >
            {item.days}
          </Text>
        </View>

        {/* Details */}
        <View style={{ marginLeft: 12, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.leaveType} Leave</Text>
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 4,
                backgroundColor: getStatusColor(item.status) + '22',
              }}
            >
              <Text
                style={{
                  color: getStatusColor(item.status),
                  fontWeight: '600',
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={'date-range'} color={ERP_COLOR_CODE.ERP_BLACK} size={14} />
              <Text style={{ fontSize: 13, color: ERP_COLOR_CODE.ERP_666 }}>{item.from}</Text>
            </View>
            <Text style={{ fontSize: 13, color: ERP_COLOR_CODE.ERP_BLACK }}>→</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={'date-range'} color={ERP_COLOR_CODE.ERP_BLACK} size={14} />
              <Text style={{ fontSize: 13, color: ERP_COLOR_CODE.ERP_666 }}>{item.to}</Text>
            </View>
          </View>

          {item.remarks ? (
            <Text style={{ fontSize: 12, color: ERP_COLOR_CODE.ERP_BLACK, marginTop: 4 }}>{item.remarks}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <FlatList
        data={['']}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={() => {
          return (
            <>
              <View
                style={{
                  backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                  borderTopWidth: 1,
                  borderTopColor: ERP_COLOR_CODE.ERP_WHITE,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#F8F9FA',
                    margin: 1,
                    padding: 16,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PieChart
                      data={getSummaryData()}
                      donut
                      radius={70}
                      innerRadius={40}
                      focusOnPress
                      centerLabelComponent={() => {
                        const total = data.length;
                        return (
                          <View>
                            <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
                              {total}
                            </Text>
                            <Text style={{ fontSize: 12, color: ERP_COLOR_CODE.ERP_666, textAlign: 'center' }}>
                              Total
                            </Text>
                          </View>
                        );
                      }}
                    />

                    <View style={{ marginLeft: 16 }}>
                      {getSummaryData().map((item, index) => (
                        <View
                          key={index}
                          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
                        >
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: item.color,
                              marginRight: 6,
                            }}
                          />
                          <Text style={{ fontSize: 13 }}>
                            {item.text} ({item.value})
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {showFilter && (
                <>
                  <View
                    style={{
                      margin: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
                    }}
                  >
                    <MaterialIcons name="search" size={22} color="#777" />
                    <TextInput
                      placeholder="Search leave by type or remarks..."
                      style={{ flex: 1, marginLeft: 6 }}
                      value={search}
                      onChangeText={setSearch}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    {TABS.map(tab => (
                      <TouchableOpacity
                        key={tab}
                        onPress={() => setFilter(tab)}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          borderRadius: 8,
                          marginLeft: 12,
                          backgroundColor:
                            filter === tab ? ERP_COLOR_CODE.ERP_APP_COLOR : '#e0e0e0',
                        }}
                      >
                        <Text
                          style={{
                            color: filter === tab ? ERP_COLOR_CODE.ERP_WHITE : '#444',
                            fontWeight: '600',
                            fontSize: 13,
                          }}
                        >
                          {tab}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({ section: { title } }) => (
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: ERP_COLOR_CODE.ERP_APP_COLOR,
                      paddingVertical: 6,
                      paddingHorizontal: 16,
                      borderBottomColor: '#ddd',
                    }}
                  >
                    {title}
                  </Text>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                  <View style={{ height: Dimensions.get('screen').height * 0.65 }}>
                    <NoData />
                  </View>
                }
              />
            </>
          );
        }}
      ></FlatList>
    </View>
  );
};

export default LeaveListPage;
