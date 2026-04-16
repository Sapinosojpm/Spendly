import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const InsightCard = ({ title, description, type = 'success' }) => {
  const getIcon = () => {
    // Safety check for icons
    switch (type) {
      case 'danger': 
        return AlertCircle ? <AlertCircle size={28} color={COLORS.black} strokeWidth={3} /> : null;
      case 'warning': 
        return AlertTriangle ? <AlertTriangle size={28} color={COLORS.black} strokeWidth={3} /> : null;
      case 'success': 
        return CheckCircle ? <CheckCircle size={28} color={COLORS.black} strokeWidth={3} /> : null;
      default: 
        return TrendingUp ? <TrendingUp size={28} color={COLORS.black} strokeWidth={3} /> : null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'danger': return COLORS.danger;
      case 'warning': return COLORS.primary;
      case 'success': return COLORS.accent;
      default: return COLORS.white;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBgColor() }]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.textContainer}>
        {title && <Text style={styles.title}>{title.toUpperCase()}</Text>}
        <Text style={styles.message}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  iconContainer: {
    marginRight: 16,
    width: 52,
    height: 52,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    fontWeight: '700',
  },
});

export default InsightCard;
