import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  User, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Trash2,
  ChevronRight,
  PieChart
} from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';
import BrutalistConfirmationModal from '../components/BrutalistConfirmationModal';

const ProfileScreen = ({ navigation }) => {
  const { 
    income, 
    setIncome, 
    allocations, 
    setAllocations, 
    paydayDays, 
    setPaydayDays,
    clearData,
    getTotals
  } = useBudgetStore();

  const [showResetModal, setShowResetModal] = useState(false);
  const totals = getTotals();
  const totalSpent = totals.spent.Bills + totals.spent.Wants + totals.spent.Savings;
  const totalAllocated = totals.allocated.Bills + totals.allocated.Wants + totals.allocated.Savings;

  const [localIncome, setLocalIncome] = useState(income.toString());

  const handleUpdateIncome = () => {
    const value = parseFloat(localIncome);
    if (isNaN(value) || value < 0) {
      Alert.alert("Error", "Maglagay ng tamang halaga para sa kita.");
      return;
    }
    setIncome(value);
    Alert.alert("Success", "Na-save na ang iyong bagong kita!");
  };

  const handleConfirmReset = () => {
    clearData();
    setShowResetModal(false);
    navigation.navigate('Landing');
  };

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={40} color={COLORS.black} strokeWidth={3} />
            </View>
            <View>
              <Text style={styles.profileName}>JUAN BUDGETER</Text>
              <Text style={styles.profileRole}>Brutalist Saver</Text>
            </View>
          </View>

          {/* Stats Snapshot */}
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>SNAPSTAT</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>NA-TOTAL NA GASTOS</Text>
                <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
              </View>
              <View style={[styles.statItem, { borderLeftWidth: 3, borderColor: COLORS.black, paddingLeft: 16 }]}>
                <Text style={styles.statLabel}>NATITIRANG BUDGET</Text>
                <Text style={[styles.statValue, { color: COLORS.accent }]}>
                  {formatCurrency(totalAllocated - totalSpent)}
                </Text>
              </View>
            </View>
          </View>

          {/* Income Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={COLORS.black} strokeWidth={3} />
              <Text style={styles.sectionTitle}>BUWANANG KITA</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={localIncome}
                onChangeText={setLocalIncome}
                keyboardType="numeric"
                placeholder="Halaga..."
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateIncome}>
                <Text style={styles.saveBtnText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget Rules Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <PieChart size={20} color={COLORS.black} strokeWidth={3} />
              <Text style={styles.sectionTitle}>BUDGET RULE (50-30-20)</Text>
            </View>
            <View style={styles.allocationRow}>
              <View style={[styles.allocItem, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.allocValue}>{allocations.Bills}%</Text>
                <Text style={styles.allocLabel}>BILLS</Text>
              </View>
              <View style={[styles.allocItem, { backgroundColor: COLORS.secondary }]}>
                <Text style={styles.allocValue}>{allocations.Wants}%</Text>
                <Text style={styles.allocLabel}>WANTS</Text>
              </View>
              <View style={[styles.allocItem, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.allocValue}>{allocations.Savings}%</Text>
                <Text style={styles.allocLabel}>IPON</Text>
              </View>
            </View>
            <Text style={styles.hintText}>*Ang standard rule para sa disiplinadong Pinoy.*</Text>
          </View>

          {/* Payday Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={COLORS.black} strokeWidth={3} />
              <Text style={styles.sectionTitle}>ARAW NG SAHOD</Text>
            </View>
            <View style={styles.paydayRow}>
              {paydayDays.map((day, idx) => (
                <View key={idx} style={styles.paydayBadge}>
                  <Text style={styles.paydayText}>Day {day}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.editIcon}>
                <ChevronRight size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <TouchableOpacity 
            style={styles.dangerBtn}
            onPress={() => setShowResetModal(true)}
          >
            <Trash2 size={24} color={COLORS.white} strokeWidth={3} />
            <Text style={styles.dangerBtnText}>BALIKTARAN (RESET DATA)</Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: COLORS.black,
    padding: 20,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: COLORS.black,
    padding: 12,
    fontSize: 18,
    fontWeight: '800',
    backgroundColor: '#F0F0F0',
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  saveBtnText: {
    fontWeight: '900',
    fontSize: 14,
  },
  allocationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  allocItem: {
    flex: 1,
    padding: 12,
    borderWidth: 3,
    borderColor: COLORS.black,
    alignItems: 'center',
  },
  allocValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
  },
  allocLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.black,
  },
  hintText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  paydayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paydayBadge: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  paydayText: {
    fontWeight: '800',
    fontSize: 14,
  },
  editIcon: {
    marginLeft: 'auto',
  },
  dangerBtn: {
    backgroundColor: COLORS.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 4,
    borderColor: COLORS.black,
    gap: 12,
    marginTop: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  dangerBtnText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
  },
});

export default ProfileScreen;
