import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Save } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const MotivationalQuote = ({ quote }) => {
  return (
    <View style={styles.card}>
      <View style={styles.tab}>
        <Save size={20} color={COLORS.white} strokeWidth={3} fill={COLORS.white} />
      </View>
      <Text style={styles.quoteText}>"{quote}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 64,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    position: 'relative',
  },
  tab: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 48,
    height: 48,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.black,
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
});

export default MotivationalQuote;
