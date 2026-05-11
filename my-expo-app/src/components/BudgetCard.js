import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency, calculatePercentage, getStatusColor } from '../utils/calculations';
import useTheme from '../utils/useTheme';
import ProgressBar from './ProgressBar';

const BudgetCard = ({ title, allocated, spent, remaining }) => {
  const C = useTheme();
  const percentage = calculatePercentage(spent, allocated);
  const statusColor = getStatusColor(percentage);

  const S = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: C.card, padding: 16, marginBottom: 20,
      borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1, shadowRadius: 0, elevation: 0, width: '100%',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 8 },
    title:  { fontSize: 18, fontWeight: '900', color: C.text, flex: 1 },
    remaining: { fontSize: 12, fontWeight: '900', textAlign: 'right', maxWidth: '40%' },
    details: {
      flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
      backgroundColor: C.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      padding: 10, borderWidth: 2, borderColor: C.border, gap: 4,
    },
    label:      { fontSize: 11, color: C.textMuted, marginBottom: 2, fontWeight: '900', opacity: 0.8 },
    value:      { fontSize: 16, fontWeight: '900', color: C.text },
    rightAlign: { alignItems: 'flex-end', flex: 1 },
    progressContainer: { borderWidth: 2, borderColor: C.border, height: 14, borderRadius: 0, overflow: 'hidden' },
    footer:          { marginTop: 8, alignItems: 'flex-end' },
    percentageText:  { fontSize: 12, color: C.text, fontWeight: '900' },
  }), [C]);

  return (
    <View style={S.card}>
      <View style={S.header}>
        <Text style={S.title}>{title.toUpperCase()}</Text>
        <Text style={[S.remaining, { color: statusColor }]}>
          {formatCurrency(remaining)} NATITIRA
        </Text>
      </View>
      <View style={S.details}>
        <View>
          <Text style={S.label}>NA-SPEND</Text>
          <Text style={S.value}>{formatCurrency(spent)}</Text>
        </View>
        <View style={S.rightAlign}>
          <Text style={S.label}>BUDGET</Text>
          <Text style={S.value}>{formatCurrency(allocated)}</Text>
        </View>
      </View>
      <View style={S.progressContainer}>
        <ProgressBar percentage={percentage} color={statusColor} />
      </View>
      <View style={S.footer}>
        <Text style={S.percentageText}>{percentage.toFixed(0)}% NA NG LIMIT</Text>
      </View>
    </View>
  );
};

export default BudgetCard;
