import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Pattern, Rect, Path, Defs } from 'react-native-svg';
import { COLORS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const GridBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default GridBackground;
