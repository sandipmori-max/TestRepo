import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';
 
interface SlideButtonProps {
  onSlideSuccess: () => void;
  label: string;
  successColor?: string;
  loading?: boolean;
  completed?: boolean;
  blocked?: boolean;
}

const SLIDE_WIDTH = Dimensions.get('screen').width - 30;
const SLIDER_SIZE = 44;

const SlideButton: React.FC<SlideButtonProps> = ({
  onSlideSuccess,
  label,
  successColor = ERP_COLOR_CODE.ERP_APP_COLOR,
  loading = false,
  completed = false,
   blocked = false,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  // 🔹 Reset knob automatically if API fails (completed = false)
  useEffect(() => {
    if (!loading && !completed && blocked) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, completed, blocked]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !loading && !completed,
      onMoveShouldSetPanResponder: () => !loading && !completed,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= SLIDE_WIDTH - SLIDER_SIZE) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SLIDE_WIDTH - SLIDER_SIZE - 20) {
          // Completed slide → call API
          Animated.timing(translateX, {
            toValue: SLIDE_WIDTH - SLIDER_SIZE,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSlideSuccess();
          });
        } else {
          // Reset back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer, { borderColor: successColor }]}>
        <Text style={styles.label}>
          {loading ? 'Please wait...' : completed ? '✔ Done' : label}
        </Text>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.slider,
            { backgroundColor: successColor, transform: [{ translateX }] },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialIcons
              name={completed ? 'task-alt' : 'keyboard-double-arrow-right'}
              color="white"
              size={22}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sliderContainer: {
    width: SLIDE_WIDTH,
    height: SLIDER_SIZE,
    borderRadius: 6, // 🔹 square style with light rounding
    borderWidth: 2,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: '600',
    color: '#555',
  },
  slider: {
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default SlideButton;
