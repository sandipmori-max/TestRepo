import React from 'react';
import { Image, View } from 'react-native';
import { TabIconProps } from './type';
import { getBottomTabIcon } from '../../utils/helpers';
import { styles } from './tab_style';
 
const TabIcon: React.FC<TabIconProps & { focused: boolean }> = ({ name, color, size, focused }) => {
  const iconSource = getBottomTabIcon(name, focused);

  return (
    <View style={styles.container}>
      {focused && <View style={styles.activeLine} />}
      <Image source={iconSource} style={styles.icon(size, focused, color)} />
    </View>
  );
};

export default TabIcon;
