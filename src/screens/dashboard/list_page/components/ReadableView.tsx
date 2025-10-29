/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Animated,
  PanResponder,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { formatDateToDDMMMYYYY } from '../../../../utils/helpers';
import { styles } from '../list_page_style';
import NoData from '../../../../components/no_data/NoData';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import MemoizedFooterView from './MemoizedFooterView';

// enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** SWIPEABLE ROW **/
const SwipeableRow = ({ children, onDelete, id }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const rowWidth = useRef(0);
  const DISMISS_THRESHOLD = -120;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < DISMISS_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -rowWidth.current,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onDelete && onDelete(id);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      onLayout={(e) => (rowWidth.current = e.nativeEvent.layout.width)}
      style={{ backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}
    >
      

      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }], backgroundColor: ERP_COLOR_CODE.ERP_WHITE }}
      >
        {children}
      </Animated.View>
    </View>
  );
};
/** END SWIPEABLE ROW **/

const ReadableView = ({
  configData,
  filteredData,
  loadingListId,
  totalAmount,
  pageParamsName,
  pageName,
  handleActionButtonPressed,
  setIsFilterVisible,
  setSearchQuery,
  totalQty,
  isFromBusinessCard,
  isFromAlertCard,
  handleDeleteNotification
}: any) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const [listData, setListData] = useState(filteredData || []);

  const handleDelete = (item) => {
    console.log("id", item);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    handleDeleteNotification(item)
    // setListData((prev) => prev.filter((_, idx) => idx !== id));
  };

  const getButtonMeta = (key: string) => {
    if (!key || !configData?.length)
      return { label: 'Action', color: ERP_COLOR_CODE.ERP_COLOR };
    const configItem = configData.find(
      (cfg) => cfg.datafield?.toLowerCase() === key.toLowerCase()
    );
    return {
      label: configItem?.headertext || 'Action',
      color: configItem?.colorcode || ERP_COLOR_CODE.ERP_COLOR,
    };
  };

  const RenderCard = ({ item, index }: any) => {
    if (!item) return null;
    const name = item?.name || `Item #${index + 1}`;
    const subName = item?.number || `Item #${index + 1}`;
    const [isRemarksExpanded, setRemarksExpanded] = useState(false);

    const status = item?.status;
    const date = item?.date;
    const remarks = item?.remarks;
    const address = item?.address;
    const amount = item?.amount;
    const btnKeys = Object.keys(item).filter((key) => key.startsWith('btn_'));
    const baseUrl = item?.image && item?.image?.replace(/^https:\/\\//i, 'http://');
    const authUser = item?.authuser;

    const avatarLetter =
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join('') || name.substring(0, 2).toUpperCase();

    const card = (
      <View
        style={{
          backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingBottom: 6,
          marginVertical: 4,
          paddingTop: 6,
          borderWidth: 1,
          borderColor: ERP_COLOR_CODE.ERP_ddd,
        }}
      >
        {/* main touchable */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={async () => {
            if (authUser) return;
            if (item?.id !== undefined) {
              setIsFilterVisible(false);
              setSearchQuery('');
              navigation.navigate('Page', {
                item,
                title: pageParamsName,
                id: item?.id,
                url: pageName,
                isFromBusinessCard,
              });
            }
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 34,
              backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            {item?.image && item?.image !== '' ? (
              <Image source={{ uri: baseUrl }} style={styles.profileImage} />
            ) : (
              <Text
                style={{
                  color: ERP_COLOR_CODE.ERP_WHITE,
                  fontWeight: '400',
                  fontSize: 16,
                }}
              >
                {avatarLetter}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700' }} numberOfLines={1}>
              {name}
            </Text>
            <Text style={{ fontSize: 12 }} numberOfLines={1}>
              {subName}
            </Text>
          </View>

          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 12,
                color: ERP_COLOR_CODE.ERP_BLACK,
              }}
            >
              {status}
            </Text>
            {!!date && (
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 12,
                  color: ERP_COLOR_CODE.ERP_BLACK,
                }}
              >
                {formatDateToDDMMMYYYY(date)}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (authUser) return;
            if (item?.id !== undefined) {
              navigation.navigate('Page', {
                item,
                title: pageParamsName,
                id: item?.id,
                url: pageName,
                isFromBusinessCard,
              });
            }
          }}
        >
          {(remarks || address || amount) && (
            <View style={{ marginTop: 6 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '70%' }}>
                  {!!remarks && (
                    <View>
                      <Text
                        numberOfLines={isRemarksExpanded ? undefined : 2}
                        style={{
                          color: ERP_COLOR_CODE.ERP_777,
                          fontStyle: 'italic',
                          marginBottom: 6,
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        {remarks}
                      </Text>
                      {remarks.length > 66 && (
                        <TouchableOpacity
                          onPress={() =>
                            setRemarksExpanded((prev) => !prev)
                          }
                        >
                          <Text
                            style={{
                              fontWeight: '600',
                              fontSize: 12,
                              color: ERP_COLOR_CODE.ERP_COLOR,
                              marginBottom: 6,
                            }}
                          >
                            {isRemarksExpanded ? 'See Less ▲' : 'See More ▼'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
                <View style={{ width: '30%', alignItems: 'flex-end' }}>
                  {!!amount && (
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'right',
                        fontSize: 14,
                        fontWeight: '700',
                        color: '#28a745',
                      }}
                    >
                      ₹ {amount}
                    </Text>
                  )}
                </View>
              </View>
              {!!address && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginVertical: 4,
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons
                    name="info-outline"
                    size={16}
                    color={ERP_COLOR_CODE.ERP_APP_COLOR}
                  />
                  <Text>{address}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        <View>
          {item?.html && <MemoizedFooterView item={item} index={index} />}
        </View>

        {btnKeys?.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 1 }}>
            {btnKeys?.map((key, idx) => {
              const actionValue = item[key];
              const { label, color } = getButtonMeta(key);
              return (
                <TouchableOpacity
                  key={`${key}-${idx}`}
                  style={{
                    backgroundColor: authUser ? '#C6C6C6' : color,
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    borderRadius: 4,
                    flexGrow: 1,
                    maxWidth: (screenWidth - 64) / 2,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (authUser) return;
                    handleActionButtonPressed(
                      actionValue,
                      label,
                      color,
                      item?.id
                    );
                  }}
                >
                  <Text
                    style={{
                      color: ERP_COLOR_CODE.ERP_WHITE,
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );

    return (
      <>
      {
        isFromAlertCard ? <SwipeableRow id={index} onDelete={() => handleDelete(item)}>
 
        {card}
      </SwipeableRow> : 
      <>
       {card} 

      </>
      }
      </>
      
    );
  };

  if (!loadingListId && listData?.length === 0) {
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
    <View style={{ flex: 1, marginTop: 2 }}>
      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={listData}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => <RenderCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {listData?.length > 0 && (
        <View
          style={{
            marginTop: 6,
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#f1f1f1',
            borderWidth: 1,
            borderColor: ERP_COLOR_CODE.ERP_ddd,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            {totalQty && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: ERP_COLOR_CODE.ERP_333,
                  }}
                >
                  Quantity :-
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginLeft: 8,
                  }}
                >
                  {totalQty?.toFixed(2)}
                </Text>
              </View>
            )}

            {totalAmount && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: ERP_COLOR_CODE.ERP_333,
                  }}
                >
                  Amount :-
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginLeft: 8,
                  }}
                >
                  ₹ {totalAmount?.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: ERP_COLOR_CODE.ERP_333,
              }}
            >
              {listData?.length} Row(s)
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReadableView;
