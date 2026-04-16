import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import { formatCurrency, calculatePercentage } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import ExpenseItem from '../components/ExpenseItem';
import GridBackground from '../components/GridBackground';

const ReportsScreen = ({ navigation }) => {
  const [isWeekly, setIsWeekly] = React.useState(false);
  const { expenses, income, getTotals, getWeeklyStats } = useBudgetStore();
  
  const monthlyTotals = getTotals();
  const weeklyStats = getWeeklyStats();
  
  const totals = isWeekly ? { 
    spent: weeklyStats.breakdown, 
    allocated: Object.fromEntries(Object.entries(monthlyTotals.allocated).map(([k, v]) => [k, v / 4])),
    remaining: Object.fromEntries(Object.entries(weeklyStats.breakdown).map(([k, v]) => [k, (monthlyTotals.allocated[k] / 4) - v]))
  } : monthlyTotals;

  const totalSpent = Object.values(totals.spent).reduce((a, b) => a + b, 0);
  const divisor = isWeekly ? (income / 4) : income;
  const totalPercentage = (totalSpent / divisor) * 100;

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={28} color={COLORS.black} strokeWidth={3} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ULAT NG GASTOS</Text>
          <View style={{ width: 54 }} />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isWeekly && styles.toggleBtnActive]}
            onPress={() => setIsWeekly(false)}
          >
            <Text style={[styles.toggleText, !isWeekly && styles.toggleTextActive]}>MONTHLY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, isWeekly && styles.toggleBtnActive]}
            onPress={() => setIsWeekly(true)}
          >
            <Text style={[styles.toggleText, isWeekly && styles.toggleTextActive]}>WEEKLY</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>KABUUANG GASTOS</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalSpent)}</Text>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text style={styles.itemVal}>{totalPercentage.toFixed(1)}%</Text>
                <Text style={styles.itemLabel}>NG KITA</Text>
              </View>
              <View style={styles.itemSeparator} />
              <View style={styles.summaryItem}>
                <Text style={styles.itemVal}>{formatCurrency(income - totalSpent)}</Text>
                <Text style={styles.itemLabel}>NATITIRA</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>KATEGORYA</Text>
          <View style={styles.statsList}>
            {Object.entries(totals.spent).map(([cat, spent]) => {
              const allocated = totals.allocated[cat];
              const perc = calculatePercentage(spent, allocated);
              
              return (
                <View key={cat} style={styles.statRow}>
                  <View style={styles.statInfo}>
                    <Text style={styles.catName}>{cat.toUpperCase()}</Text>
                    <Text style={styles.catSpent}>
                      {formatCurrency(spent)} / {formatCurrency(allocated)}
                    </Text>
                  </View>
                  <View style={[styles.percBadge, { backgroundColor: perc > 100 ? COLORS.danger : COLORS.accent }]}>
                    <Text style={styles.percText}>{perc.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>KASAYSAYAN</Text>
          <View style={styles.historyList}>
            {expenses.length > 0 ? (
              [...expenses].reverse().map((expense) => (
                <ExpenseItem key={expense.id} {...expense} />
              ))
            ) : (
              <Text style={styles.emptyText}>Wala pang gastos.</Text>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  backBtn: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.black,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: COLORS.black,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.4)', // Slightly transparent to show grid
    marginHorizontal: 16,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginTop: 10,
    minHeight: '100%',
  },
  summaryCard: {
    backgroundColor: COLORS.secondary,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  summaryLabel: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.6,
  },
  summaryValue: {
    color: COLORS.black,
    fontSize: 44,
    fontWeight: '900',
    marginVertical: 12,
    letterSpacing: -1,
  },
  summaryDetails: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: COLORS.black,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  itemVal: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: '900',
  },
  itemLabel: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    opacity: 0.6,
  },
  itemSeparator: {
    width: 2,
    backgroundColor: COLORS.black,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: 1,
  },
  statsList: {
    backgroundColor: COLORS.white,
    padding: 8,
    marginBottom: 32,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
  },
  catSpent: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 4,
    fontWeight: '700',
    opacity: 0.6,
  },
  percBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  percText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '900',
  },
  historyList: {
    marginBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: '900',
    opacity: 0.5,
    paddingVertical: 30,
  },
});

export default ReportsScreen;
