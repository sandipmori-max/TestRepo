import React, { useMemo } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const MAX_ITEMS_PER_LIST = 5;
const { height } = Dimensions.get('screen');

const PieChartSection = ({ pieChartData, navigation, t, scrollY }) => {
  // Split data into separate lists

  const scale = scrollY.interpolate({
    inputRange: [0, height * 0.3],  
    outputRange: [1, 0.8],  
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, height * 0.2],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const [firstList, secondList] = useMemo(() => {
    if (!pieChartData) return [[], []];
    const first = pieChartData.slice(0, MAX_ITEMS_PER_LIST);
    const second = pieChartData.slice(MAX_ITEMS_PER_LIST);
    return [first, second];
  }, [pieChartData]);

  return (
    pieChartData?.length > 0 && (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
          alignItems: 'center',
        }}
      >
        <View>
          <View
            style={{
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
              style={{ width: '48%', justifyContent: 'center', alignContent: 'center' }}
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
                width: Dimensions.get('screen').width / 2 - 60,
                marginLeft: 18
              }}
            >
              {/* First List */}
              {firstList.length > 0 && (
                <View>
                  <FlatList
                    data={firstList}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: item.color,
                            marginRight: 6,
                          }}
                        />
                        <Text style={{ fontSize: 14, color: '#444' }}>
                          {item.text}: {item.value}
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
                        }}
                      />
                      <Text style={{ fontSize: 14, color: '#444' }}>
                        {item.text}: {item.value}
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
      </Animated.View>
    )
  );
};

export default PieChartSection;
