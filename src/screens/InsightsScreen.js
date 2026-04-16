import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import SpendingChart from '../components/SpendingChart';
import InsightCard from '../components/InsightCard';
import GridBackground from '../components/GridBackground';

const InsightsScreen = () => {
  const [viewMode, setViewMode] = React.useState('weekly'); // 'weekly' or 'monthly'
  const { expenses, income, getMonthlyTrend, getAIResults } = useBudgetStore();
  
  const daysCount = viewMode === 'weekly' ? 7 : 30;
  const trendData = getMonthlyTrend(daysCount);
  const { healthScore, insights } = getAIResults();

  if (expenses.length === 0) {
    return (
      <GridBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>GABAY SA GASTOS</Text>
            <Text style={styles.emptyText}>Wala pang sapat na data para sa analysis.</Text>
          </View>
        </SafeAreaView>
      </GridBackground>
    );
  }

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>GABAY SA GASTOS</Text>
            <Text style={styles.subtitle}>Smart analysis ng iyong pera.</Text>
          </View>

          <View style={styles.healthSection}>
            <View style={styles.healthScoreContainer}>
              <Text style={styles.healthTitle}>Financial Health Score</Text>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreNumber}>{healthScore}</Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
            </View>
            <Text style={styles.healthStatus}>
              {healthScore > 80 ? 'Ayos na ayos ang management!' : healthScore > 50 ? 'Gud job, pero kaya pang galingan.' : 'Kabahan ka na! Action required!'}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.trendHeader}>
              <Text style={styles.sectionTitle}>Trend ng Gastos</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity 
                  onPress={() => setViewMode('weekly')}
                  style={[styles.smallToggle, viewMode === 'weekly' && styles.smallToggleActive]}
                >
                  <Text style={[styles.smallToggleText, viewMode === 'weekly' && styles.smallToggleTextActive]}>7D</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setViewMode('monthly')}
                  style={[styles.smallToggle, viewMode === 'monthly' && styles.smallToggleActive]}
                >
                  <Text style={[styles.smallToggleText, viewMode === 'monthly' && styles.smallToggleTextActive]}>30D</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.chartCard}>
              <SpendingChart data={trendData} type={viewMode === 'weekly' ? 'bar' : 'line'} />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.insightsHeader}>
              <Text style={styles.sectionTitle}>AI Insights</Text>
              <View style={styles.snapshotBadge}>
                <Text style={styles.snapshotText}>LIVE ANALYSIS</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingTop: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 16,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginTop: 10,
    minHeight: '100%',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '800',
    opacity: 0.6,
  },
  healthSection: {
    backgroundColor: COLORS.white,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: COLORS.black,
  },
  scoreNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: COLORS.black,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    marginLeft: 4,
  },
  healthStatus: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.black,
    gap: 2,
  },
  smallToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  smallToggleActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  smallToggleText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
    opacity: 0.5,
  },
  smallToggleTextActive: {
    opacity: 1,
  },
  snapshotBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: COLORS.black,
    transform: [{ rotate: '3deg' }],
  },
  snapshotText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: '700',
    opacity: 0.5,
    paddingVertical: 30,
  },
});

export default InsightsScreen;
