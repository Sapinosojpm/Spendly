import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import SpendingChart from '../components/SpendingChart';
import InsightCard from '../components/InsightCard';
import GridBackground from '../components/GridBackground';

const InsightsScreen = () => {
  const [viewMode, setViewMode] = React.useState('weekly');
  const { expenses, income, getMonthlyTrend, getAIResults } = useBudgetStore();
  const C = useTheme();

  const daysCount = viewMode === 'weekly' ? 7 : 30;
  const trendData = getMonthlyTrend(daysCount);
  const { healthScore, insights } = getAIResults();

  const S = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1 },
    content: {
      padding: 10, paddingTop: 30,
      backgroundColor: C.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
      marginHorizontal: 16, borderWidth: 4, borderColor: C.border,
      marginTop: 10, minHeight: '100%',
    },
    header:   { marginBottom: 32 },
    title:    { fontSize: 32, fontWeight: '900', color: C.text, textTransform: 'uppercase', letterSpacing: -1 },
    subtitle: { fontSize: 16, color: C.textMuted, fontWeight: '800', opacity: 0.8 },
    healthSection: {
      backgroundColor: C.card, padding: 24, marginBottom: 32, alignItems: 'center',
      borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0,
    },
    healthTitle: { fontSize: 14, fontWeight: '900', color: C.text, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 },
    scoreBox: {
      flexDirection: 'row', alignItems: 'baseline',
      backgroundColor: C.primary, paddingHorizontal: 24, paddingVertical: 12,
      borderWidth: 3, borderColor: C.border,
    },
    scoreNumber: { fontSize: 54, fontWeight: '900', color: '#000' },
    scoreLabel:  { fontSize: 20, fontWeight: '900', color: '#000', marginLeft: 4 },
    healthStatus:{ marginTop: 20, fontSize: 16, fontWeight: '900', color: C.text, textAlign: 'center' },
    section:      { marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: C.text, marginBottom: 16, textTransform: 'uppercase' },
    trendHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    toggleRow:    { flexDirection: 'row', backgroundColor: C.cardAlt, padding: 3, borderWidth: 2, borderColor: C.border, gap: 2 },
    smallToggle:  { paddingHorizontal: 10, paddingVertical: 4 },
    smallToggleActive: { backgroundColor: C.primary, borderWidth: 1.5, borderColor: C.border },
    smallToggleText:   { fontSize: 10, fontWeight: '900', color: C.text, opacity: 0.5 },
    smallToggleTextActive: { opacity: 1 },
    snapshotBadge: {
      backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 4,
      borderWidth: 2, borderColor: C.border, transform: [{ rotate: '3deg' }],
    },
    snapshotText: { fontSize: 10, fontWeight: '900', color: '#000' },
    insightsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    chartCard: {
      backgroundColor: C.card, padding: 16, borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0,
    },
    emptyText: { textAlign: 'center', color: C.textMuted, fontWeight: '700', paddingVertical: 30 },
  }), [C]);

  if (expenses.length === 0) {
    return (
      <GridBackground>
        <SafeAreaView style={S.safeArea}>
          <View style={S.content}>
            <Text style={S.title}>GABAY SA GASTOS</Text>
            <Text style={S.emptyText}>Wala pang sapat na data para sa analysis.</Text>
          </View>
        </SafeAreaView>
      </GridBackground>
    );
  }

  return (
    <GridBackground>
      <SafeAreaView style={S.safeArea}>
        <ScrollView contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
          <View style={S.header}>
            <Text style={S.title}>GABAY SA GASTOS</Text>
            <Text style={S.subtitle}>Smart analysis ng iyong pera.</Text>
          </View>

          <View style={S.healthSection}>
            <Text style={S.healthTitle}>Financial Health Score</Text>
            <View style={S.scoreBox}>
              <Text style={S.scoreNumber}>{healthScore}</Text>
              <Text style={S.scoreLabel}>/100</Text>
            </View>
            <Text style={S.healthStatus}>
              {healthScore > 80 ? 'Ayos na ayos ang management!' : healthScore > 50 ? 'Gud job, pero kaya pang galingan.' : 'Kabahan ka na! Action required!'}
            </Text>
          </View>

          <View style={S.section}>
            <View style={S.trendHeader}>
              <Text style={S.sectionTitle}>Trend ng Gastos</Text>
              <View style={S.toggleRow}>
                <TouchableOpacity onPress={() => setViewMode('weekly')} style={[S.smallToggle, viewMode === 'weekly' && S.smallToggleActive]}>
                  <Text style={[S.smallToggleText, viewMode === 'weekly' && S.smallToggleTextActive]}>7D</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setViewMode('monthly')} style={[S.smallToggle, viewMode === 'monthly' && S.smallToggleActive]}>
                  <Text style={[S.smallToggleText, viewMode === 'monthly' && S.smallToggleTextActive]}>30D</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={S.chartCard}>
              <SpendingChart data={trendData} type={viewMode === 'weekly' ? 'bar' : 'line'} />
            </View>
          </View>

          <View style={S.section}>
            <View style={S.insightsHeader}>
              <Text style={S.sectionTitle}>AI Insights</Text>
              <View style={S.snapshotBadge}>
                <Text style={S.snapshotText}>LIVE ANALYSIS</Text>
              </View>
            </View>
            {insights.map(insight => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GridBackground>
  );
};

export default InsightsScreen;
