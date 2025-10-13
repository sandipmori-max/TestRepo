import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import NoData from '../../../../components/no_data/NoData';
import FullViewLoader from '../../../../components/loader/FullViewLoader';
import ERPIcon from '../../../../components/icon/ERPIcon';
import { getERPMenuThunk } from '../../../../store/slices/auth/thunk';
import { styles } from '../entry/entry_style';
import {
  createBookmarksTable,
  getBookmarks,
  getDBConnection,
  insertOrUpdateBookmark,
} from '../../../../utils/sqlite';
import ErrorMessage from '../../../../components/error/Error';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const accentColors = ['#dbe0f5ff', '#c8f3edff', '#faf1e0ff', '#f0e1e1ff', '#f2e3f8ff', '#e0f3edff'];

const ReportTab = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, activeToken } = useAppSelector(state => state.auth);
  const { menu, isMenuLoading } = useAppSelector(state => state.auth);
  const { user } = useAppSelector(state => state?.auth);

  const allList = menu?.filter(item => item?.isReport === 'R') ?? [];
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState(allList);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const list = showBookmarksOnly ? filteredList.filter(item => bookmarks[item.id]) : filteredList;

  useEffect(() => {
    (async () => {
      const db = await getDBConnection();
      await createBookmarksTable(db);
      const saved = await getBookmarks(db, user?.id);
      setBookmarks(saved);
    })();
  }, []);

  const toggleBookmark = async (id: string) => {
    const updated = !bookmarks[id];
    setBookmarks(prev => ({ ...prev, [id]: updated }));
    const db = await getDBConnection();
    await insertOrUpdateBookmark(db, id, user?.id, updated);
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      const filtered = allList.filter(
        item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredList(filtered);
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchText, allList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        showSearch ? (
          <View
            style={{
              width: Dimensions.get('screen').width - 70,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search report here..."
              style={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                paddingHorizontal: 12,
                height: 36,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowSearch(false);
                setSearchText('');
              }}
            >
              <MaterialIcons
                name="clear"
                size={24}
                color={ERP_COLOR_CODE.ERP_WHITE}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ color: ERP_COLOR_CODE.ERP_WHITE, fontSize: 18, fontWeight: '600' }}>
            Reports
          </Text>
        ),
      headerRight: () => (
        <>
          {allList.length > 5 && !showSearch && (
            <ERPIcon name="search" onPress={() => setShowSearch(true)} />
          )}
          {!showSearch && (
            <>
              <ERPIcon name="refresh" onPress={() => setIsRefresh(!isRefresh)} />
              <ERPIcon
                name={!isHorizontal ? 'list' : 'apps'}
                onPress={() => setIsHorizontal(prev => !prev)}
              />
              <ERPIcon
                name={!showBookmarksOnly ? 'bookmark' : 'dashboard'}
                onPress={() => setShowBookmarksOnly(prev => !prev)}
              />
            </>
          )}
        </>
      ),
      headerLeft: () => (
        <ERPIcon extSize={24} isMenu={true} name="menu" onPress={() => navigation.openDrawer()} />
      ),
    });
  }, [navigation, showBookmarksOnly, isHorizontal, isRefresh, showSearch, searchText, allList]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getERPMenuThunk());
    }
  }, [isAuthenticated, dispatch, activeToken, isRefresh]);

  const renderItem = ({ item, index }: any) => {
    const backgroundColor = accentColors[index % accentColors.length];

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor, flexDirection: isHorizontal ? 'row' : 'column' }]}
        activeOpacity={0.7}
        onPress={() => {
          if (item?.url.includes('.') || item?.url.includes('?') || item?.url.includes('/')) {
            navigation.navigate('Web', { item });
          } else {
            navigation.navigate('List', { item });
          }
        }}
      >
        <TouchableOpacity
          onPress={() => toggleBookmark(item.id)}
          style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
        >
          <MaterialIcons
            size={24}
            name={bookmarks[item?.id] ? 'bookmark' : 'bookmark-outline'}
            color={ERP_COLOR_CODE.ERP_BLACK}
          />
        </TouchableOpacity>

        <View style={[styles.iconContainer, { backgroundColor: ERP_COLOR_CODE.ERP_WHITE }]}>
          <Text style={styles.iconText}>
            {item?.icon && item?.icon !== ''
              ? item.icon
              : item?.name
              ? (() => {
                  const words = item.name.trim().split(' ').filter(Boolean);
                  if (words.length === 1) {
                    return words[0].substring(0, 2).toUpperCase();
                  } else {
                    return words
                      .slice(0, 2)
                      .map(word => word[0].toUpperCase())
                      .join('');
                  }
                })()
              : '?'}
          </Text>
        </View>

        <View
          style={{
            marginLeft: isHorizontal ? 16 : 0,
            marginTop: isHorizontal ? 0 : 12,
            alignItems: isHorizontal ? 'flex-start' : 'center',
          }}
        >
          <Text numberOfLines={2} style={styles.title}>
            {item?.name}
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            {item?.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isMenuLoading) {
    return (
      <View style={styles.centered}>
        <FullViewLoader />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <ErrorMessage message={error} />
      </View>
    );
  }

  if (!isMenuLoading && list.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
        }}
      >
        <NoData />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}>
      <FlatList
        key={`${isHorizontal}-${showBookmarksOnly}-${searchText}`}
        keyboardShouldPersistTaps="handled"
        data={list}
        keyExtractor={(item, index) => index.toString()}
        numColumns={isHorizontal ? 1 : 2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={!isHorizontal ? styles.columnWrapper : undefined}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReportTab;
