import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Settings as SettingsIcon,
  DollarSign,
  PieChart,
  Calendar,
  Trash2,
  ChevronRight,
  Palette,
  CheckCircle2,
  Edit2,
} from 'lucide-react-native';
import { THEMES, THEME_ORDER } from '../utils/themes';
import { formatCurrency } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import GridBackground from '../components/GridBackground';
import BrutalistConfirmationModal from '../components/BrutalistConfirmationModal';

const ProfileScreen = ({ navigation }) => {
  const {
    income,
    setIncome,
    allocations,
    paydayDays,
    clearData,
    getTotals,
  } = useBudgetStore();

  const C = useTheme();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const totals = getTotals();
  const totalSpent = totals.spent.Bills + totals.spent.Wants + totals.spent.Savings;
  const totalAllocated = totals.allocated.Bills + totals.allocated.Wants + totals.allocated.Savings;

  const [localIncome, setLocalIncome] = useState(income.toString());

  const handleUpdateIncome = () => {
    const value = parseFloat(localIncome);
    if (isNaN(value) || value < 0) {
      setShowValidationModal(true);
      return;
    }
    setIncome(value);
    setShowSuccessModal(true);
  };

  const handleConfirmReset = () => {
    clearData();
    setShowResetModal(false);
  };

  const S = useMemo(() => StyleSheet.create({
    scrollContent: {
      padding: 16,
      paddingTop: 30,
      backgroundColor: C.dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
      borderWidth: 4,
      borderColor: C.border,
      marginTop: 10,
      minHeight: '100%',
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
      gap: 16,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      backgroundColor: C.primary,
      borderWidth: 4,
      borderColor: C.border,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: C.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    profileName: { fontSize: 24, fontWeight: '900', color: C.text },
    profileRole: { fontSize: 14, fontWeight: '700', color: C.text, opacity: 0.6, textTransform: 'uppercase' },
    statsCard: {
      backgroundColor: C.dark ? C.card : '#111',
      padding: 20,
      marginBottom: 24,
      borderWidth: 4,
      borderColor: C.primary,
      shadowColor: C.primary,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.8,
      shadowRadius: 0,
    },
    cardTitle: { color: C.primary, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statItem: { flex: 1 },
    statLabel: { color: '#aaa', fontSize: 10, fontWeight: '700', opacity: 0.9, marginBottom: 4 },
    statValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
    statValueAccent: { color: C.accent, fontSize: 18, fontWeight: '900' },
    sectionCard: {
      backgroundColor: C.card,
      padding: 20,
      borderWidth: 4,
      borderColor: C.border,
      marginBottom: 20,
      shadowColor: C.shadow,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '900', color: C.text, flex: 1 },
    inputRow: { flexDirection: 'row', gap: 12 },
    input: {
      flex: 1,
      borderWidth: 3,
      borderColor: C.border,
      padding: 12,
      fontSize: 18,
      fontWeight: '800',
      backgroundColor: C.cardAlt,
      color: C.text,
    },
    saveBtn: {
      backgroundColor: C.accent,
      paddingHorizontal: 20,
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: C.border,
      shadowColor: C.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    saveBtnText: { fontWeight: '900', fontSize: 14, color: '#000' },
    allocationRow: { flexDirection: 'row', gap: 8 },
    allocItem: { flex: 1, padding: 12, borderWidth: 3, borderColor: C.border, alignItems: 'center' },
    allocValue: { fontSize: 20, fontWeight: '900', color: '#000' },
    allocLabel: { fontSize: 10, fontWeight: '800', color: '#000' },
    hintText: { fontSize: 11, fontStyle: 'italic', marginTop: 12, fontWeight: '600', opacity: 0.6, color: C.text },
    paydayRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    paydayBadge: { backgroundColor: C.cardAlt, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: C.border },
    paydayText: { fontWeight: '800', fontSize: 14, color: C.text },
    editIcon: { padding: 4 },
    dangerBtn: {
      backgroundColor: '#FF4D4D',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderWidth: 4,
      borderColor: '#000',
      gap: 12,
      marginTop: 12,
      shadowColor: '#000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    dangerBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  }), [C]);

  return (
    <GridBackground>
      <SafeAreaView style={baseStyles.safeArea}>
        <StatusBar style={C.dark ? 'light' : 'dark'} />
        <ScrollView
          style={baseStyles.scrollView}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={S.profileHeader}>
            <View style={S.avatarContainer}>
              <User size={40} color="#000" strokeWidth={3} />
            </View>
            <View>
              <Text style={S.profileName}>JUAN BUDGETER</Text>
              <Text style={S.profileRole}>PRO ACCOUNT</Text>
            </View>
          </View>

          <View style={S.statsCard}>
            <Text style={S.cardTitle}>SNAPSTAT</Text>
            <View style={S.statRow}>
              <View style={S.statItem}>
                <Text style={S.statLabel}>NA-TOTAL NA GASTOS</Text>
                <Text style={S.statValue}>{formatCurrency(totalSpent)}</Text>
              </View>
              <View style={[S.statItem, { borderLeftWidth: 3, borderColor: C.primary, paddingLeft: 16 }]}>
                <Text style={S.statLabel}>NATITIRA</Text>
                <Text style={S.statValueAccent}>{formatCurrency(totalAllocated - totalSpent)}</Text>
              </View>
            </View>
          </View>

          <View style={S.sectionCard}>
            <View style={S.sectionHeader}>
              <DollarSign size={20} color={C.primary} strokeWidth={3} />
              <Text style={S.sectionTitle}>BUWANANG KITA</Text>
            </View>
            <View style={S.inputRow}>
              <TextInput
                style={S.input}
                value={localIncome}
                onChangeText={setLocalIncome}
                keyboardType="numeric"
                placeholder="Halaga..."
                placeholderTextColor={C.textMuted}
              />
              <TouchableOpacity style={S.saveBtn} onPress={handleUpdateIncome}>
                <Text style={S.saveBtnText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.sectionCard}>
            <View style={S.sectionHeader}>
              <PieChart size={20} color={C.primary} strokeWidth={3} />
              <Text style={S.sectionTitle}>BUDGET RULE ({allocations.Bills}-{allocations.Wants}-{allocations.Savings})</Text>
              <TouchableOpacity style={S.editIcon} onPress={() => navigation.navigate('EditBudget')}>
                <Edit2 size={18} color={C.primary} strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <View style={S.allocationRow}>
              <View style={[S.allocItem, { backgroundColor: C.primary }]}>
                <Text style={S.allocValue}>{allocations.Bills}%</Text>
                <Text style={S.allocLabel}>BILLS</Text>
              </View>
              <View style={[S.allocItem, { backgroundColor: C.secondary }]}>
                <Text style={S.allocValue}>{allocations.Wants}%</Text>
                <Text style={S.allocLabel}>WANTS</Text>
              </View>
              <View style={[S.allocItem, { backgroundColor: C.accent }]}>
                <Text style={S.allocValue}>{allocations.Savings}%</Text>
                <Text style={S.allocLabel}>IPON</Text>
              </View>
            </View>
            <Text style={S.hintText}>*Ang standard rule para sa disiplinadong Pinoy.*</Text>
          </View>

          <View style={S.sectionCard}>
            <View style={S.sectionHeader}>
              <Calendar size={20} color={C.primary} strokeWidth={3} />
              <Text style={S.sectionTitle}>ARAW NG SAHOD</Text>
            </View>
            <View style={S.paydayRow}>
              {paydayDays.map((day, idx) => (
                <View key={idx} style={S.paydayBadge}>
                  <Text style={S.paydayText}>Day {day}</Text>
                </View>
              ))}
              <TouchableOpacity style={S.editIcon}>
                <ChevronRight size={24} color={C.text} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={S.dangerBtn} onPress={() => setShowResetModal(true)}>
            <Trash2 size={24} color="#fff" strokeWidth={3} />
            <Text style={S.dangerBtnText}>BALIKTARAN (RESET DATA)</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BrutalistConfirmationModal
          visible={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleConfirmReset}
          title="SIGURADO KA BA?"
          message="Mabubura lahat ng iyong gastos at data. Hindi na ito maibabalik, idol."
          confirmText="BURA LAHAT!"
          cancelText="HUWAG MUNA"
        />

        <BrutalistConfirmationModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onConfirm={() => setShowSuccessModal(false)}
          title="NA-SAVE NA!"
          message="Updated na ang iyong buwanang kita. Kita mo na ang bago mong budget limits sa Dashboard."
          confirmText="AYOS!"
          cancelText="CLOSE"
        />

        <BrutalistConfirmationModal
          visible={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          onConfirm={() => setShowValidationModal(false)}
          title="MALI ANG INPUT"
          message="Maglagay lodi ng tamang halaga para sa iyong kita (Numbers only)."
          confirmText="GEH, AYUSIN KO"
          cancelText="BACK"
        />
      </SafeAreaView>
    </GridBackground>
  );
};

const baseStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { paddingHorizontal: 12 },
});

export default ProfileScreen;
