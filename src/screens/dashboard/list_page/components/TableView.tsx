import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React from 'react';
import { styles } from '../list_page_style';
import { formatHeaderTitle } from '../../../../utils/helpers';
import NoData from '../../../../components/no_data/NoData';
import { useNavigation } from '@react-navigation/native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';

const TableView = ({
  configData,
  filteredData,
  loadingListId,
  totalAmount,
  pageParamsName,
  pageName,
  handleActionButtonPressed,
  setIsFilterVisible,
  setSearchQuery,
}: any) => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  const getButtonMeta = (key: string) => {
    if (!key || !configData?.length) return { label: 'Action', color: ERP_COLOR_CODE.ERP_COLOR };
    const configItem = configData?.find(
      cfg => cfg?.datafield?.toLowerCase() === key?.toLowerCase(),
    );
    return {
      label: configItem?.headertext || 'Action',
      color: configItem?.colorcode || ERP_COLOR_CODE.ERP_COLOR,
    };
  };

  const allKeys =
    filteredData && filteredData.length > 0
      ? Object.keys(filteredData[0]).filter(key => key !== 'id')
      : [];

  function splitInto4Columns(keys: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = { clm1: [], clm2: [], clm3: [], clm4: [] };
    const filteredKeys = keys?.filter(key => !key.startsWith('btn_'));
    const firstFour = filteredKeys.slice(0, 4);
    const rest = filteredKeys.slice(4);

    result.clm1.push(firstFour[0] || '');
    result.clm2.push(firstFour[1] || '');
    result.clm3.push(firstFour[2] || '');
    result.clm4.push(firstFour[3] || '');

    rest.forEach((key, index) => {
      const colIndex = index % 4;
      const columnKey = `clm${colIndex + 1}` as keyof typeof result;
      result[columnKey].push(key);
    });

    return result;
  }

  function splitInto4Rows(keys: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = { clm1: [], clm2: [], clm3: [], clm4: [] };

    const firstFour = keys.slice(0, 4);
    const rest = keys.slice(4);

    result.clm1.push(firstFour[0] || '');
    result.clm2.push(firstFour[1] || '');
    result.clm3.push(firstFour[2] || '');
    result.clm4.push(firstFour[3] || '');

    rest.forEach((key, index) => {
      const colIndex = index % 4;
      const columnKey = `clm${colIndex + 1}` as keyof typeof result;
      result[columnKey].push(key);
    });

    return result;
  }

  const columns = splitInto4Columns(allKeys);
  const rows = splitInto4Rows(allKeys);

  const TableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeaderRow]}>
      {Object.values(columns).map((colItems, colIndex) => (
        <View key={`col-${colIndex}`} style={{ flexDirection: 'column', marginRight: 1 }}>
          {colItems.map(key => (
            <Text
              key={key}
              style={[styles.tableHeaderCell, { minWidth: 96, maxWidth: 100, marginBottom: 0 }]}
              numberOfLines={1}
            >
              {formatHeaderTitle(key)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    const rowBackgroundColor = isEven ? ERP_COLOR_CODE.ERP_WHITE : '#f8faf3ff';
    const authUser = item?.authuser;

    const btnKeys = Object.keys(item).filter(key => key.startsWith('btn_'));

    return (
      <TouchableOpacity
        onPress={async () => {
          if (authUser) {
            return;
          }
          if (item?.id !== undefined) {
            setIsFilterVisible(false);
            setSearchQuery('');
            navigation.navigate('Page', {
              item,
              title: pageParamsName,
              id: item?.id,
              url: pageName,
            });
          }
        }}
      >
        {' '}
        <View
          style={[styles.tableRow, { backgroundColor: rowBackgroundColor, flexDirection: 'row' }]}
        >
          {Object.values(rows).map((colItems, colIndex) => (
            <View key={`row-col-${colIndex}`} style={{ flexDirection: 'column', marginRight: 1 }}>
              {colItems
                .filter(key => !key.startsWith('btn_'))
                .map(key => {
                  let value = item[key];
                  if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                  } else if (value === null || value === undefined) {
                    value = '';
                  } else {
                    value = String(value);
                  }
                  return (
                    <Text
                      key={`${key}-${item?.id || Math.random()}`}
                      style={[styles.tableCell, { minWidth: 96, maxWidth: '25%', marginBottom: 0 }]}
                      numberOfLines={1}
                    >
                      {value || '-'}
                    </Text>
                  );
                })}
            </View>
          ))}
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            minWidth: 120,
          }}
        >
          {btnKeys?.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 8 }}>
              {btnKeys?.map((key, idx) => {
                const actionValue = item[key];
                const authUser = item['authuser'];
                const { label, color } = getButtonMeta(key);

                return (
                  <TouchableOpacity
                    key={`${key}-${idx}`}
                    style={{
                      backgroundColor: authUser ? 'gray' : color,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      flexGrow: 1,
                      maxWidth: (screenWidth - 64) / 2,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      handleActionButtonPressed(actionValue, label, color, item?.id);
                    }}
                  >
                    <Text
                      style={{ color: ERP_COLOR_CODE.ERP_WHITE, fontWeight: '600', fontSize: 13 }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </TouchableOpacity>
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
            backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
          }}
        >
          <NoData />
        </View>
      </>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        marginTop: 4,
      }}
    >
      <FlatList
        data={['']}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => {
          return (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              data={filteredData}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />
          );
        }}
      ></FlatList>

      {filteredData?.length > 0 ? (
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
          {totalAmount !== 0 && (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: ERP_COLOR_CODE.ERP_333 }}>
                Total Amount
              </Text>
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
          )}

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: ERP_COLOR_CODE.ERP_333 }}>
              Total Rows
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 2,
              }}
            >
              {filteredData?.length}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default TableView;
