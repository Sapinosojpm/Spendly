import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, Settings, Info } from 'lucide-react-native';
import { formatCurrency } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import BudgetCard from '../components/BudgetCard';
import ExpenseItem from '../components/ExpenseItem';
import GridBackground from '../components/GridBackground';

const DashboardScreen = ({ navigation }) => {
  const { income, expenses, getTotals, getPaydayInfo } = useBudgetStore();
  const C = useTheme();

  const totals = getTotals();
  const recentExpenses = [...expenses].reverse().slice(0, 5);

  const S = useMemo(() => StyleSheet.create({
    safeArea:    { flex: 1 },
    scrollView:  { paddingHorizontal: 12 },
    scrollContent: {
      padding: 16, paddingTop: 30,
      backgroundColor: C.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
      borderWidth: 4, borderColor: C.border,
      marginTop: 10, minHeight: '100%',
    },
    header: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 32,
    },
    greeting: {
      fontSize: 32, fontWeight: '900',
      color: C.text, letterSpacing: -1,
    },
    incomeBox: {
      backgroundColor: C.accent, paddingHorizontal: 8, paddingVertical: 2,
      borderWidth: 2, borderColor: C.border, alignSelf: 'flex-start', marginTop: 4,
    },
    incomeText: { fontSize: 14, color: '#000', fontWeight: '900' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: {
      width: 44, height: 44, backgroundColor: C.card,
      justifyContent: 'center', alignItems: 'center',
      marginLeft: 8, borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1, shadowRadius: 0, elevation: 0,
    },
    budgetGrid: { marginBottom: 32 },
    recentSection: {
      backgroundColor: C.card, padding: 24,
      borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1, shadowRadius: 0, elevation: 0,
    },
    sectionHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20, fontWeight: '900',
      color: C.text, letterSpacing: 1,
    },
    viewAll: {
      color: C.primary, fontSize: 12,
      fontWeight: '900', textDecorationLine: 'underline',
    },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyText:    { fontSize: 18, fontWeight: '900', color: C.text },
    emptySubtext: { fontSize: 14, color: C.textMuted, marginTop: 8, fontWeight: '700' },
    fab: {
      position: 'absolute', bottom: 120, right: 30,
      width: 56, height: 56, backgroundColor: C.primary,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1, shadowRadius: 0, elevation: 8,
    },
  }), [C]);

  return (
    <GridBackground>
      <SafeAreaView style={S.safeArea}>
        <StatusBar style={C.dark ? 'light' : 'dark'} />
        <ScrollView
          style={S.scrollView}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={S.header}>
            <View>
              <Text style={S.greeting}>BUDGET KO</Text>
              <View style={S.incomeBox}>
                <Text style={S.incomeText}>KITA: {formatCurrency(income)}</Text>
              </View>
            </View>
            <View style={S.headerActions}>
              <TouchableOpacity style={S.iconBtn} onPress={() => navigation.navigate('Landing')}>
                <Info size={22} color={C.text} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity style={S.iconBtn} onPress={() => navigation.navigate('Settings')}>
                <Settings size={22} color={C.text} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.budgetGrid}>
            <BudgetCard title="Mga Bayarin"       allocated={totals.allocated.Bills}   spent={totals.spent.Bills}   remaining={totals.remaining.Bills}   />
            <BudgetCard title="Personal na Gastos" allocated={totals.allocated.Wants}   spent={totals.spent.Wants}   remaining={totals.remaining.Wants}   />
            <BudgetCard title="Para sa Ipon"       allocated={totals.allocated.Savings} spent={totals.spent.Savings} remaining={totals.remaining.Savings} />
          </View>

          <View style={S.recentSection}>
            <View style={S.sectionHeader}>
              <Text style={S.sectionTitle}>HULING GASTOS</Text>
              {expenses.length > 5 && (
                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                  <Text style={S.viewAll}>TIGNAN LAHAT</Text>
                </TouchableOpacity>
              )}
            </View>
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <ExpenseItem key={expense.id} {...expense} />
              ))
            ) : (
              <View style={S.emptyState}>
                <Text style={S.emptyText}>Wala pang gastos.</Text>
                <Text style={S.emptySubtext}>Pindutin ang + para mag-log.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

        <TouchableOpacity style={S.fab} onPress={() => navigation.navigate('AddExpense')}>
          <Plus size={28} color="#000" strokeWidth={4} />
        </TouchableOpacity>
      </SafeAreaView>
    </GridBackground>
  );
};

export default DashboardScreen;
