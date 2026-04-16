import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { formatCurrency, calculatePercentage, getStatusColor } from '../utils/calculations';
import ProgressBar from './ProgressBar';

const BudgetCard = ({ title, allocated, spent, remaining }) => {
  const percentage = calculatePercentage(spent, allocated);
  const statusColor = getStatusColor(percentage);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={[styles.remaining, { color: statusColor }]}>
          {formatCurrency(remaining)} NATITIRA
        </Text>
      </View>

      <View style={styles.details}>
        <View>
          <Text style={styles.label}>NA-SPEND</Text>
          <Text style={styles.value}>{formatCurrency(spent)}</Text>
        </View>
        <View style={styles.rightAlign}>
          <Text style={styles.label}>BUDGET</Text>
          <Text style={styles.value}>{formatCurrency(allocated)}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar percentage={percentage} color={statusColor} />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.percentageText}>{percentage.toFixed(0)}% NA NG LIMIT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    flex: 1,
  },
  remaining: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
    maxWidth: '40%',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 10,
    borderWidth: 2,
    borderColor: COLORS.black,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.black,
    marginBottom: 2,
    fontWeight: '900',
    opacity: 0.6,
  },
  value: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
  },
  rightAlign: {
    alignItems: 'flex-end',
    flex: 1,
  },
  progressContainer: {
    borderWidth: 2,
    borderColor: COLORS.black,
    height: 14,
    borderRadius: 0,
    overflow: 'hidden',
  },
  footer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '900',
  },
});

export default BudgetCard;
