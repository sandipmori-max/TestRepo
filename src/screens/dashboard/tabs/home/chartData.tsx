import React, { useMemo } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const MAX_ITEMS_PER_LIST = 5;

const PieChartSection = ({ pieChartData, navigation, t }) => {
  const [firstList, secondList] = useMemo(() => {
    if (!pieChartData) return [[], []];
    const first = pieChartData.slice(0, MAX_ITEMS_PER_LIST);
    const second = pieChartData.slice(MAX_ITEMS_PER_LIST);
    return [first, second];
  }, [pieChartData]);

  return (
    pieChartData?.length > 0 && (
      <View>
        <View
          style={{
            marginVertical: 4,
            borderColor: 'black',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            height: Dimensions.get('screen').height * 0.22,
          }}
        >
          {/* Pie Chart */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Web', { isFromChart: true })}
            style={{
              width: '48%',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <PieChart
              data={pieChartData}
              donut
              radius={90}
              innerRadius={80}
              textSize={14}
              textColor="#000"
              showValuesAsLabels
              labelPosition="outside"
              innerCircleColor="#fff"
              centerLabelComponent={() => (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {t('home.dashboard')}
                </Text>
              )}
            />
          </TouchableOpacity>

          {/* Legends - separate lists */}
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              height: Dimensions.get('screen').height * 0.22,
              marginLeft: 8,
              width: '44%',
              overflow: 'hidden',
            }}
          >
            {/* First List */}
            {firstList.length > 0 && (
              <View
                style={{
                  width: '90%',
                }}
              >
                <FlatList
                  data={firstList}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: item.color,
                          marginRight: 6,
                          flexDirection: 'row',
                          gap: 4,
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontWeight: '500',
                          maxWidth: 80,
                        }}
                      >
                        {item.text}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 8,
                          fontSize: 14,
                          color: item.color,
                          fontWeight: '800',
                        }}
                      >
                        :- {item.value}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => `first-${index}`}
                />
              </View>
            )}

            {/* Second List */}
          </View>
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 12 }}>
          {secondList.length > 0 && (
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                data={secondList}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginHorizontal: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: item.color,
                        marginRight: 6,
                        flexDirection: 'row',
                        gap: 4,
                      }}
                    />
                    <Text numberOfLines={1} style={{ maxWidth: 80 }}>
                      {item.text}
                    </Text>
                    <Text
                      style={{ marginLeft: 8, fontSize: 14, color: item.color, fontWeight: '800' }}
                    >
                      :- {item.value}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => `second-${index}`}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </View>
    )
  );
};

export default PieChartSection;
