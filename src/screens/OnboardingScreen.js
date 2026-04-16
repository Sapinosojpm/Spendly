import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, BUDGET_RULES } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';

const OnboardingScreen = ({ navigation }) => {
  const [income, setIncome] = useState('');
  const [payday1, setPayday1] = useState('15');
  const [payday2, setPayday2] = useState('30');
  const [isCustom, setIsCustom] = useState(false);
  const [allocations, setAllocations] = useState(BUDGET_RULES.default);

  const setStoreIncome = useBudgetStore((state) => state.setIncome);
  const setStoreAllocations = useBudgetStore((state) => state.setAllocations);
  const setStorePaydayDays = useBudgetStore((state) => state.setPaydayDays);
  const setOnboarded = useBudgetStore((state) => state.setOnboarded);

  const handleStart = () => {
    if (!income || parseFloat(income) <= 0) {
      alert('Mag-enter po ng tamang monthly income.');
      return;
    }

    const total = Object.values(allocations).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      alert('Dapat 100% ang kabuuan ng iyong budget.');
      return;
    }

    // Process paydays
    const days = [];
    if (payday1) days.push(parseInt(payday1));
    if (payday2) days.push(parseInt(payday2));
    
    // Sort and remove duplicates/invalid
    const finalDays = [...new Set(days)]
      .filter(d => d >= 1 && d <= 31)
      .sort((a, b) => a - b);

    if (finalDays.length === 0) {
      alert('Mag-enter po ng kahit isang petsa ng sahod (1-31).');
      return;
    }

    setStoreIncome(parseFloat(income));
    setStoreAllocations(allocations);
    setStorePaydayDays(finalDays);
    setOnboarded(true);
  };

  const updateAllocation = (key, value) => {
    const num = parseInt(value) || 0;
    setAllocations(prev => ({ ...prev, [key]: num }));
  };

  return (
    <GridBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>WELCOME TO SPENDLY</Text>
              <View style={styles.subtitleBox}>
                <Text style={styles.subtitle}>AYUSIN NATIN ANG IYONG BUDGET.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>MAGKANO ANG KITA MO KADA BUWAN?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 25000"
                  keyboardType="numeric"
                  value={income}
                  onChangeText={setIncome}
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>KAILAN ANG SAHOD MO?</Text>
              <View style={styles.paydayRow}>
                <View style={styles.paydayBox}>
                  <Text style={styles.paydayLabel}>PETSA 1</Text>
                  <TextInput
                    style={styles.paydayInput}
                    placeholder="15"
                    keyboardType="numeric"
                    value={payday1}
                    onChangeText={setPayday1}
                    maxLength={2}
                  />
                </View>
                <View style={styles.paydayBox}>
                  <Text style={styles.paydayLabel}>PETSA 2</Text>
                  <TextInput
                    style={styles.paydayInput}
                    placeholder="30"
                    keyboardType="numeric"
                    value={payday2}
                    onChangeText={setPayday2}
                    maxLength={2}
                  />
                </View>
              </View>
              <Text style={styles.hint}>Iwanan na blangko kung isa lang ang sahod.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>BUDGET ALLOCATION</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, !isCustom && styles.toggleBtnActive]}
                  onPress={() => {
                    setIsCustom(false);
                    setAllocations(BUDGET_RULES.default);
                  }}
                >
                  <Text style={styles.toggleText}>50/30/20 RULE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, isCustom && styles.toggleBtnActive]}
                  onPress={() => setIsCustom(true)}
                >
                  <Text style={styles.toggleText}>CUSTOM</Text>
                </TouchableOpacity>
              </View>

              {isCustom ? (
                <View style={styles.customContainer}>
                  {Object.entries(allocations).map(([key, value]) => (
                    <View key={key} style={styles.allocationRow}>
                      <Text style={styles.allocationLabel}>{key.toUpperCase()} (%)</Text>
                      <TextInput
                        style={styles.allocationInput}
                        keyboardType="numeric"
                        value={String(value)}
                        onChangeText={(val) => updateAllocation(key, val)}
                      />
                    </View>
                  ))}
                  <View style={styles.totalHintBox}>
                    <Text style={styles.totalHint}>
                      TOTAL: {Object.values(allocations).reduce((a, b) => a + b, 0)}% (Dapat ay 100%)
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.ruleInfo}>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleVal}>50%</Text>
                    <Text style={styles.ruleName}>MGA BAYARIN (BILLS)</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleVal}>30%</Text>
                    <Text style={styles.ruleName}>PERSONAL (WANTS)</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleVal}>20%</Text>
                    <Text style={styles.ruleName}>IPON (SAVINGS)</Text>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>UMPISAHAN NA!</Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.black,
    lineHeight: 46,
    letterSpacing: -1,
  },
  subtitleBox: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: COLORS.black,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '900',
  },
  section: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  input: {
    padding: 20,
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    padding: 4,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
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
  ruleInfo: {
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    gap: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ruleVal: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    backgroundColor: COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
  },
  customContainer: {
    gap: 16,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  allocationLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
  },
  allocationInput: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'right',
    width: 60,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.black,
    padding: 4,
  },
  totalHintBox: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
    marginTop: 8,
  },
  totalHint: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '900',
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 18,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  paydayRow: {
    flexDirection: 'row',
    gap: 16,
  },
  paydayBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  paydayLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 4,
    opacity: 0.6,
  },
  paydayInput: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
    padding: 0,
  },
  hint: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '700',
    marginTop: 8,
    opacity: 0.6,
  },
});

export default OnboardingScreen;
