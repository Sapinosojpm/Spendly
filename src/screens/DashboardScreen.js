import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  Plus, 
  Settings, 
  Calendar,
  Info
} from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import BudgetCard from '../components/BudgetCard';
import ExpenseItem from '../components/ExpenseItem';
import GridBackground from '../components/GridBackground';

const DashboardScreen = ({ navigation }) => {
  const { 
    income, 
    expenses, 
    getTotals, 
    getPaydayInfo 
  } = useBudgetStore();
  
  const totals = getTotals();
  const paydayInfo = getPaydayInfo();

  const recentExpenses = [...expenses].reverse().slice(0, 5);

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>BUDGET KO</Text>
              <View style={styles.incomeBox}>
                <Text style={styles.incomeText}>KITA: {formatCurrency(income)}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.iconBtn} 
                onPress={() => navigation.navigate('Landing')}
              >
                <Info size={22} color={COLORS.black} strokeWidth={3} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconBtn} 
                onPress={() => navigation.navigate('Onboarding')}
              >
                <Settings size={22} color={COLORS.black} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.budgetGrid}>
            <BudgetCard 
              title="Mga Bayarin"
              allocated={totals.allocated.Bills}
              spent={totals.spent.Bills}
              remaining={totals.remaining.Bills}
            />
            <BudgetCard 
              title="Personal na Gastos"
              allocated={totals.allocated.Wants}
              spent={totals.spent.Wants}
              remaining={totals.remaining.Wants}
            />
            <BudgetCard 
              title="Para sa Ipon"
              allocated={totals.allocated.Savings}
              spent={totals.spent.Savings}
              remaining={totals.remaining.Savings}
            />
          </View>

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>HULING GASTOS</Text>
              {expenses.length > 5 && (
                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                  <Text style={styles.viewAll}>TIGNAN LAHAT</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <ExpenseItem key={expense.id} {...expense} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Wala pang gastos.</Text>
                <Text style={styles.emptySubtext}>Pindutin ang + para mag-log.</Text>
              </View>
            )}
          </View>
          
          <View style={{ height: 140 }} />
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Plus size={28} color={COLORS.black} strokeWidth={4} />
        </TouchableOpacity>
      </SafeAreaView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 12,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 4,
    borderColor: COLORS.black,
    marginTop: 10,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  incomeBox: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: COLORS.black,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  incomeText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paydayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: COLORS.black,
    gap: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  paydayBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  budgetGrid: {
    marginBottom: 32,
  },
  recentSection: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 1,
  },
  viewAll: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 8,
    opacity: 0.6,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    width: 56,
    height: 56,
    backgroundColor: COLORS.primary,
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
});

export default DashboardScreen;
