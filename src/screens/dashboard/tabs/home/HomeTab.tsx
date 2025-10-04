import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { styles } from './home_style';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import FullViewLoader from '../../../../components/loader/FullViewLoader';
import NoData from '../../../../components/no_data/NoData';
import ERPIcon from '../../../../components/icon/ERPIcon';
import { getERPDashboardThunk } from '../../../../store/slices/auth/thunk';
import ErrorMessage from '../../../../components/error/Error';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import TaskListScreen from '../../../task_module/task_list/TaskListScreen';
import TaskDetailsBottomSheet from '../../../task_module/task_details/TaskDetailsScreen';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import RenderHTML from 'react-native-render-html';
import Footer from './Footer';
import PieChartSection from './chartData';

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { dashboard, isDashboardLoading, isAuthenticated, error, user } = useAppSelector(
    state => state.auth,
  );
  const [loadingPageId, setLoadingPageId] = useState<any>(null);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const theme = useAppSelector(state => state?.theme);
  const [actionLoader, setActionLoader] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <ERPIcon
            name="refresh"
            onPress={() => {
              setActionLoader(true);
              setIsRefresh(!isRefresh);
              dispatch(getERPDashboardThunk());
              setTimeout(() => {
                setActionLoader(false);
              }, 100);
            }}
            isLoading={actionLoader}
          />
          <ERPIcon
            name={!isHorizontal ? 'list' : 'apps'}
            onPress={() => setIsHorizontal(prev => !prev)}
          />
        </>
      ),
      headerLeft: () => (
        <>
          <ERPIcon
            extSize={24}
            isMenu={true}
            name="menu"
            onPress={() => navigation?.openDrawer()}
          />
        </>
      ),
    });
  }, [navigation, isRefresh, actionLoader, isHorizontal]);

  useFocusEffect(
    useCallback(() => {
      setLoadingPageId(true);

      if (isAuthenticated) {
        dispatch(getERPDashboardThunk());
      }

      return () => {};
    }, [isAuthenticated, dispatch]),
  );

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     dispatch(getERPDashboardThunk());
  //   }, 120 * 1000);
  //   return () => clearInterval(intervalId);
  // }, [dispatch]);

  const getInitials = (text?: string) => {
    if (!text) return '?';
    const trimmed = text?.trim();
    if (trimmed?.length === 0) return '?';
    return trimmed.slice(0, 2).toUpperCase();
  };

  const accentColors = ['#4C6FFF', '#00C2A8', '#FFB020', '#FF6B6B', '#9B59B6', '#20C997'];

  const pieChartData = dashboard
    .filter(item => {
      const num = Number(item?.data);
      return item?.title !== 'Attendance Code' && item?.data !== '' && !isNaN(num) && num > 0;
    })
    .map((item, index) => ({
      value: Number(item?.data),
      color: accentColors[index % accentColors.length],
      text: item?.title,
    }));

  const renderDashboardItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        key={item?.id || index}
        style={[
          styles.dashboardItem,
          {
            paddingLeft: 4,
            marginHorizontal: 4,
            backgroundColor: accentColors[index % accentColors.length],
            borderRadius: 8,
            width: isHorizontal ? '100%' : '48%',
          },
        ]}
        activeOpacity={0.7}
        onPress={async () => {
          if (item?.url.includes('.') || item?.url.includes('?') || item?.url.includes('/')) {
            navigation.navigate('Web', { item });
          } else {
            navigation.navigate('List', { item });
          }
        }}
      >
        <View
          style={{
            backgroundColor: theme === 'dark' ? ERP_COLOR_CODE.ERP_333 : ERP_COLOR_CODE.ERP_WHITE,
            borderRadius: 8,
          }}
        >
          <View style={styles.dashboardItemContent}>
            <View style={styles.dashboardItemHeader}>
              <View style={styles.dashboardItemTopRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: accentColors[index % accentColors.length] },
                  ]}
                >
                  <Text style={styles.iconText}>{getInitials(item?.name)}</Text>
                </View>
                <View style={styles.headerTextWrap}>
                  <Text
                    style={[
                      styles.dashboardItemText,
                      {
                        color:
                          theme === 'dark' ? ERP_COLOR_CODE.ERP_WHITE : ERP_COLOR_CODE.ERP_BLACK,
                        flexShrink: 1,
                        includeFontPadding: false,
                        textAlignVertical: 'top',
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {!isHorizontal ? item?.title.replace(' ', '\n') : item?.title}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: item.data ? 4 : 0 }}>
              {loadingPageId === (item.id || String(index)) && (
                <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={ERP_COLOR_CODE.ERP_007AFF} />
                  <Text style={{ marginLeft: 8, color: ERP_COLOR_CODE.ERP_6C757D }}>
                    Loading page...
                  </Text>
                </View>
              )}
              {item.data ? (
                <View style={styles.dataContainer}>
                  <Footer footer={item?.data} index={index} accentColors={accentColors} />
                </View>
              ) : (
                <View style={styles.dataContainer}>
                  <Text style={styles.dashboardItemData} numberOfLines={2}>
                    {'-'}
                  </Text>
                </View>
              )}
            </View>
            {item?.footer ? (
              <>
                <Footer footer={item?.footer} index={index} accentColors={accentColors} />
              </>
            ) : (
              <Text
                style={{
                  color: accentColors[index % accentColors.length],
                }}
              >
                {'-'}
              </Text>
            )}
            {item?.footer || item.data ? (
              <> </>
            ) : (
              <View style={{ height: 12, width: 12, backgroundColor: '' }}></View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dummyUpcomingEvents = [];

  const dummyUpcomingBirthdays = [
    { id: 'b1', name: 'Amit Sharma', date: '28 sep 2025', type: 'Up-coming-Birthday' },
  ];

  const dummyUpcomingAnniversaries = [
    { id: 'w1', name: 'Rohit & Neha', date: '03 sep 2025', type: 'Up-coming-work-anniversary' },
  ];

  const todayEvents = [{ id: 't2', date: 'Today', title: 'UX Review', type: 'Event' }];

  const todayBirthdays = [];

  const todayAnniversaries = [];

  const dummyTasks = [
    {
      id: '1',
      title: 'Fix login bug',
      description: 'Check the API response and fix login issue',
      assignedTo: 'jr1',
      createdBy: 'senior1',
      status: 'pending',
      updatedAt: '2025-09-10T10:00:00Z',
    },
  ];

  function SmallItem({ left, primary, secondary, type }) {
    return (
      <TouchableOpacity style={styles.itemRow} activeOpacity={0.8}>
        <View style={styles.avatar}>{left}</View>
        <View style={styles.itemText}>
          <Text numberOfLines={1} style={styles.itemPrimary}>
            {primary}
          </Text>
          <Text style={styles.itemType}>{type}</Text>
        </View>
        <View>
          <Text style={styles.itemSecondary}>{secondary}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={theme === 'dark' ? styles.containerDark : styles.container}>
      <Text
        numberOfLines={1}
        style={{
          color: 'white',
          marginTop: 1,
          backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
          padding: 12,
          textAlign: 'center',
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
        }}
      >
        {user?.companyName || ''}
      </Text>
      {isDashboardLoading ? (
        <FullViewLoader />
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <ErrorMessage message={error} />{' '}
        </View>
      ) : dashboard?.length === 0 && !isDashboardLoading ? (
        <NoData />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={['']}
            renderItem={() => (
              <>
                {/* Pie chart section */}
                {pieChartData.length > 0 && (
                  <PieChartSection pieChartData={pieChartData} navigation={navigation} t={t} />
                )}
                {/* Dashboard items */}
                <View style={styles.dashboardSection}>
                  <FlatList
                    key={`${isHorizontal}`}
                    keyboardShouldPersistTaps="handled"
                    data={dashboard}
                    keyExtractor={item => item?.id}
                    numColumns={isHorizontal ? 1 : 2}
                    columnWrapperStyle={!isHorizontal ? styles.columnWrapper : undefined}
                    renderItem={renderDashboardItem}
                    showsVerticalScrollIndicator={false}
                  />
                </View>

                <View style={styles.grid}>
                  <View style={styles.card}>
                    <View style={{ flexDirection: 'row', marginVertical: 8, gap: 6 }}>
                      <MaterialIcons
                        size={18}
                        color={ERP_COLOR_CODE.ERP_APP_COLOR}
                        name="emoji-events"
                      />
                      <Text style={styles.cardTitle}>Events</Text>
                    </View>
                    <FlatList
                      data={todayEvents}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={styles.avatarText}>T</Text>}
                          primary={item.title}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      key={`${isHorizontal}`}
                      data={dummyUpcomingEvents}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={styles.avatarText}>E</Text>}
                          primary={item.title}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.card}>
                    <View style={{ flexDirection: 'row', marginVertical: 8, gap: 6 }}>
                      <MaterialIcons
                        size={18}
                        color={ERP_COLOR_CODE.ERP_APP_COLOR}
                        name="celebration"
                      />
                      <Text style={styles.cardTitle}>Birthday & Work-anniversary</Text>
                    </View>
                    <FlatList
                      data={todayBirthdays}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={
                            <Text style={styles.avatarText}>
                              {item.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')}
                            </Text>
                          }
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      data={dummyUpcomingBirthdays}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={
                            <Text style={styles.avatarText}>
                              {item.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')}
                            </Text>
                          }
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                    <FlatList
                      data={todayAnniversaries}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={styles.avatarText}>A</Text>}
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      data={dummyUpcomingAnniversaries}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={styles.avatarText}>W</Text>}
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 12,
                      marginVertical: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <MaterialIcons
                        size={18}
                        color={ERP_COLOR_CODE.ERP_APP_COLOR}
                        name="pending-actions"
                      />
                      <Text style={{ fontSize: 16, fontWeight: '700' }}>My Pending Tasks</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Tasks', { isFromViewAll: true });
                      }}
                    >
                      <Text style={{ color: ERP_COLOR_CODE.ERP_BORDER_LINE, fontSize: 12 }}>
                        View all
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TaskListScreen
                    tasks={dummyTasks}
                    onSelectTask={task => {
                      setSelectedTask(task);
                      setModalVisible(true);
                    }}
                    showPicker={undefined}
                    showFilter={undefined}
                  />
                </View>

                {selectedTask && (
                  <TaskDetailsBottomSheet
                    visible={modalVisible}
                    task={selectedTask}
                    role="junior"
                    onClose={() => setModalVisible(false)}
                    onUpdate={updatedTask => {
                      setModalVisible(false);
                    }}
                  />
                )}
                <View style={{ height: 10, width: 100 }} />
              </>
            )}
          />
        </>
      )}
    </View>
  );
};

export default HomeScreen;
