import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { ERP_GIF } from '../../assets';
import { styles } from './no_data_style';

const NoData = () => {
  return (
    <View style={styles.container}>
      <FastImage source={ERP_GIF.NO_DATA} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>No Data Found</Text>
      <Text style={styles.subtitle}>Oops! No data available. Please refresh or check again later.</Text>
    </View>
  );
};

export default NoData;
