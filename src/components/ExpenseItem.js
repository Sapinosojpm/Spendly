import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';

const ExpenseItem = ({ title, amount, date, category, subcategory }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconPlaceholder}>
          <Text style={styles.categoryInitial}>{category[0]}</Text>
        </View>
        <View>
          <Text style={styles.title}>{subcategory || title}</Text>
          <Text style={styles.date}>{formattedDate} • {category}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 3,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInitial: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  subcategory: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.black,
    opacity: 0.6,
  },
  amount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
  },
});

export default ExpenseItem;
