import { StyleSheet } from 'react-native';

export const baseStyle = (color: string, isMenu: boolean) =>
  StyleSheet.create({
    container: {
      height: 32,
      width: 32,
      borderWidth: isMenu ? 0 : 1,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      borderRadius: 4,
    },
  }).container;
