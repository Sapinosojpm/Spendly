import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { COLORS } from '../utils/constants';

const ProgressBar = ({ percentage, color }) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(percentage, 100), { duration: 800 });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
      backgroundColor: color || COLORS.primary,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 0,
    overflow: 'hidden',
    width: '100%',
  },
  progress: {
    height: '100%',
    borderRadius: 0,
  },
});

export default ProgressBar;
