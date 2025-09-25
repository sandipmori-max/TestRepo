/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { formatDateToDDMMMYYYY } from '../../../../utils/helpers';
import { styles } from '../list_page_style';
import NoData from '../../../../components/no_data/NoData';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const ReadableView = ({
  configData,
  filteredData,
  loadingListId,
  totalAmount,
  pageParamsName,
  pageName,
  handleActionButtonPressed,
}: any) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  const getButtonMeta = (key: string) => {
    if (!key || !configData?.length) return { label: 'Action', color: '#007BFF' };
    const configItem = configData.find(cfg => cfg.datafield?.toLowerCase() === key.toLowerCase());
    return {
      label: configItem?.headertext || 'Action',
      color: configItem?.colorcode || '#007BFF',
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

    const btnKeys = Object.keys(item).filter(key => key.startsWith('btn_'));
    const baseUrl = item?.image && item?.image?.replace(/^https:\/\//i, 'http://');
    const authUser = item?.authuser;

    const avatarLetter =
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('') || name.substring(0, 2).toUpperCase();

    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingBottom: 6,
          marginVertical: 4,
          paddingTop: 6,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={async () => {
            console.log('🚀 ~ Page:', item);

            navigation.navigate('Page', {
              item,
              title: pageParamsName,
              id: item?.id,
              url: pageName,
            });
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
              <Text style={{ color: '#fff', fontWeight: '400', fontSize: 16 }}>{avatarLetter}</Text>
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
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 12, color: '#000' }}>{status}</Text>
            {!!date && (
              <Text style={{ fontWeight: '600', fontSize: 12, color: '#ccc' }}>
                {formatDateToDDMMMYYYY(date)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (authUser) {
              return;
            }
            navigation.navigate('Page', {
              item,
              title: pageParamsName,
              id: item?.id,
              url: pageName,
            });
          }}
        >
          {(remarks || address || amount) && (
            <View style={{ marginTop: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    width: '70%',
                  }}
                >
                  {!!remarks && (
                    <>
                      <Text
                        numberOfLines={isRemarksExpanded ? undefined : 2}
                        style={{
                          color: '#777',
                          fontStyle: 'italic',
                          marginBottom: 6,
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        {remarks}
                      </Text>
                      {remarks.length > 60 && (
                        <TouchableOpacity onPress={() => setRemarksExpanded(prev => !prev)}>
                          <Text
                            style={{
                              fontWeight: '600',
                              fontSize: 12,
                              color: '#007bff',
                              marginBottom: 6,
                            }}
                          >
                            {isRemarksExpanded ? 'See Less ▲' : 'See More ▼'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
                <View
                  style={{
                    width: '30%',
                    alignItems: 'flex-end',
                  }}
                >
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
              <View>
                {!!address && (
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#444',
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    📍 {address}
                  </Text>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>

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
                    if (authUser) {
                      return;
                    }

                    handleActionButtonPressed(actionValue, label, color, item?.id);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  if (!loadingListId && filteredData?.length === 0) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <NoData />
        </View>
      </>
    );
  }
  return (
    <View style={{ flex: 1, marginTop: 2 }}>
      <FlatList
        data={filteredData}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, idx) => String(item?.id || idx)}
        renderItem={({ item, index }) => <RenderCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
      />
      {filteredData?.length > 0 && totalAmount > 0 ? (
        <View
          style={{
            marginTop: 6,
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#f1f1f1',
            borderWidth: 1,
            borderColor: '#ddd',
            marginBottom: 28,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#333' }}>Total Amount</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#28a745',
              marginTop: 2,
            }}
          >
            ₹ {totalAmount?.toFixed(2)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default ReadableView;
