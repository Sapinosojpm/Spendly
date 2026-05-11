import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/calculations';
import useTheme from '../utils/useTheme';

const ExpenseItem = ({ title, amount, date, category, subcategory }) => {
  const C = useTheme();
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const S = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 16, borderWidth: 3, borderColor: C.border,
      backgroundColor: C.card, marginBottom: 12,
    },
    leftContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: {
      width: 40, height: 40, backgroundColor: C.primary,
      borderWidth: 2, borderColor: C.border,
      justifyContent: 'center', alignItems: 'center',
    },
    categoryInitial: { color: '#000', fontWeight: '900', fontSize: 18 },
    title:  { fontSize: 14, fontWeight: '900', color: C.text, textTransform: 'uppercase' },
    date:   { fontSize: 11, fontWeight: '700', color: C.textMuted, marginTop: 2 },
    amount: { fontSize: 16, fontWeight: '900', color: C.text },
  }), [C]);

  return (
    <View style={S.container}>
      <View style={S.leftContent}>
        <View style={S.iconBox}>
          <Text style={S.categoryInitial}>{category[0]}</Text>
        </View>
        <View>
          <Text style={S.title}>{subcategory || title}</Text>
          <Text style={S.date}>{formattedDate} • {category}</Text>
        </View>
      </View>
      <Text style={S.amount}>{formatCurrency(amount)}</Text>
    </View>
  );
};

export default ExpenseItem;
