import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, List as ListIcon } from 'lucide-react-native';
import { formatCurrency, calculatePercentage } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import ExpenseItem from '../components/ExpenseItem';
import GridBackground from '../components/GridBackground';
import CalendarView from '../components/CalendarView';

const ReportsScreen = ({ navigation }) => {
  const [isWeekly, setIsWeekly] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const { expenses, income, getTotals, getWeeklyStats } = useBudgetStore();
  const C = useTheme();

  const monthlyTotals = getTotals();
  const weeklyStats   = getWeeklyStats();

  const totals = isWeekly ? {
    spent: weeklyStats.breakdown,
    allocated: Object.fromEntries(Object.entries(monthlyTotals.allocated).map(([k, v]) => [k, v / 4])),
    remaining: Object.fromEntries(Object.entries(weeklyStats.breakdown).map(([k, v]) => [k, (monthlyTotals.allocated[k] / 4) - v])),
  } : monthlyTotals;

  const totalSpent      = Object.values(totals.spent).reduce((a, b) => a + b, 0);
  const divisor         = isWeekly ? income / 4 : income;
  const totalPercentage = (totalSpent / divisor) * 100;

  const S = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: C.text, letterSpacing: -1 },
    backBtn: {
      width: 54, height: 54, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
      borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    toggleContainer: {
      flexDirection: 'row', backgroundColor: C.card,
      borderWidth: 3, borderColor: C.border,
      marginHorizontal: 20, marginBottom: 24, padding: 4,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    toggleBtn:       { flex: 1, paddingVertical: 12, alignItems: 'center' },
    toggleBtnActive: { backgroundColor: C.primary, borderWidth: 2, borderColor: C.border },
    toggleText:       { fontSize: 14, fontWeight: '900', color: C.text, letterSpacing: 1 },
    content: {
      padding: 20,
      backgroundColor: C.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
      marginHorizontal: 16, borderWidth: 4, borderColor: C.border,
      marginTop: 10, minHeight: '100%',
    },
    summaryCard: {
      backgroundColor: C.secondary, padding: 24, alignItems: 'center', marginBottom: 32,
      borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0,
    },
    summaryLabel: { color: '#000', fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, opacity: 0.7 },
    summaryValue: { color: '#000', fontSize: 44, fontWeight: '900', marginVertical: 12, letterSpacing: -1 },
    summaryDetails: { flexDirection: 'row', width: '100%', marginTop: 12, paddingTop: 20, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.2)' },
    summaryItem:    { flex: 1, alignItems: 'center' },
    itemVal:        { color: '#000', fontSize: 20, fontWeight: '900' },
    itemLabel:      { color: '#000', fontSize: 12, fontWeight: '900', marginTop: 4, opacity: 0.6 },
    itemSeparator:  { width: 2, backgroundColor: 'rgba(0,0,0,0.3)' },
    sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle:   { fontSize: 20, fontWeight: '900', color: C.text, letterSpacing: 1 },
    viewToggle: {
      flexDirection: 'row',
      backgroundColor: C.card,
      borderWidth: 2,
      borderColor: C.border,
      padding: 2,
    },
    toggleIconBtn: {
      padding: 6,
      borderRadius: 4,
    },
    toggleIconBtnActive: {
      backgroundColor: C.primary,
    },
    statsList: {
      backgroundColor: C.card, padding: 8, marginBottom: 32,
      borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0,
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 2, borderBottomColor: C.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
    statInfo: { flex: 1 },
    catName:  { fontSize: 16, fontWeight: '900', color: C.text },
    catSpent: { fontSize: 12, color: C.textMuted, marginTop: 4, fontWeight: '700' },
    percBadge:{ paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: C.border },
    percText: { color: '#000', fontSize: 14, fontWeight: '900' },
    historyList: { marginBottom: 40 },
    emptyText: { textAlign: 'center', color: C.textMuted, fontWeight: '900', paddingVertical: 30 },
  }), [C]);

  return (
    <GridBackground>
      <SafeAreaView style={S.safeArea}>
        <View style={S.header}>
          <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color={C.text} strokeWidth={3} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>ULAT NG GASTOS</Text>
          <View style={{ width: 54 }} />
        </View>

        <View style={S.toggleContainer}>
          <TouchableOpacity style={[S.toggleBtn, !isWeekly && S.toggleBtnActive]} onPress={() => setIsWeekly(false)}>
            <Text style={S.toggleText}>MONTHLY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.toggleBtn, isWeekly && S.toggleBtnActive]} onPress={() => setIsWeekly(true)}>
            <Text style={S.toggleText}>WEEKLY</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
          <View style={S.summaryCard}>
            <Text style={S.summaryLabel}>KABUUANG GASTOS</Text>
            <Text style={S.summaryValue}>{formatCurrency(totalSpent)}</Text>
            <View style={S.summaryDetails}>
              <View style={S.summaryItem}>
                <Text style={S.itemVal}>{totalPercentage.toFixed(1)}%</Text>
                <Text style={S.itemLabel}>NG KITA</Text>
              </View>
              <View style={S.itemSeparator} />
              <View style={S.summaryItem}>
                <Text style={S.itemVal}>{formatCurrency(income - totalSpent)}</Text>
                <Text style={S.itemLabel}>NATITIRA</Text>
              </View>
            </View>
          </View>

          <Text style={S.sectionTitle}>KATEGORYA</Text>
          <View style={S.statsList}>
            {Object.entries(totals.spent).map(([cat, spent]) => {
              const allocated = totals.allocated[cat];
              const perc = calculatePercentage(spent, allocated);
              return (
                <View key={cat} style={S.statRow}>
                  <View style={S.statInfo}>
                    <Text style={S.catName}>{cat.toUpperCase()}</Text>
                    <Text style={S.catSpent}>{formatCurrency(spent)} / {formatCurrency(allocated)}</Text>
                  </View>
                  <View style={[S.percBadge, { backgroundColor: perc > 100 ? '#FF4D4D' : C.accent }]}>
                    <Text style={S.percText}>{perc.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={S.sectionTitleRow}>
            <Text style={S.sectionTitle}>
              {viewMode === 'calendar' ? `MGA GASTOS (${selectedDate})` : 'KASAYSAYAN'}
            </Text>
            <View style={S.viewToggle}>
              <TouchableOpacity 
                style={[S.toggleIconBtn, viewMode === 'list' && S.toggleIconBtnActive]} 
                onPress={() => setViewMode('list')}
              >
                <ListIcon size={18} color={viewMode === 'list' ? '#000' : C.text} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[S.toggleIconBtn, viewMode === 'calendar' && S.toggleIconBtnActive]} 
                onPress={() => setViewMode('calendar')}
              >
                <CalendarIcon size={18} color={viewMode === 'calendar' ? '#000' : C.text} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {viewMode === 'calendar' && (
            <CalendarView 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />
          )}

          <View style={S.historyList}>
            {(() => {
              const filteredExpenses = viewMode === 'calendar' 
                ? expenses.filter(e => e.date.startsWith(selectedDate))
                : [...expenses].reverse();

              return filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => <ExpenseItem key={expense.id} {...expense} />)
              ) : (
                <Text style={S.emptyText}>Wala pang gastos sa araw na ito.</Text>
              );
            })()}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GridBackground>
  );
};

export default ReportsScreen;
