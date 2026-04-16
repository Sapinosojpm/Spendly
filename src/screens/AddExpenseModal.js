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
import { X, Check } from 'lucide-react-native';
import { COLORS, CATEGORIES } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';

const AddExpenseModal = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [subcategory, setSubcategory] = useState(CATEGORIES['Bills'][0]);
  const [note, setNote] = useState('');
  
  const addExpense = useBudgetStore((state) => state.addExpense);

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Mag-enter po ng tamang halaga.');
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      category,
      subcategory,
      note,
    });

    navigation.goBack();
  };

  const changeCategory = (cat) => {
    setCategory(cat);
    setSubcategory(CATEGORIES[cat][0]);
  };

  return (
    <GridBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => navigation.goBack()}
            >
              <X size={28} color={COLORS.black} strokeWidth={3} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>BAGONG GASTOS</Text>
            <View style={{ width: 54 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.amountSection}>
              <Text style={styles.label}>MAGKANO ANG GASTOS?</Text>
              <View style={styles.amountInputBox}>
                <Text style={styles.currency}>₱</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  keyboardType="numeric"
                  autoFocus
                  value={amount}
                  onChangeText={setAmount}
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>SAAN IBABAWAS?</Text>
              <View style={styles.categoryGrid}>
                {Object.keys(CATEGORIES).map((cat) => (
                  <TouchableOpacity 
                    key={cat}
                    style={[
                      styles.catBtn, 
                      category === cat && styles.catBtnActive
                    ]}
                    onPress={() => changeCategory(cat)}
                  >
                    <Text style={styles.catText}>
                      {cat === 'Bills' ? 'BAYARIN' : cat === 'Wants' ? 'WANTS' : 'IPON'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>URI NG GASTOS</Text>
              <View style={styles.subCatContainer}>
                {CATEGORIES[category].map((sub) => (
                  <TouchableOpacity 
                    key={sub}
                    style={[
                      styles.subCatBtn,
                      subcategory === sub && styles.subCatBtnActive
                    ]}
                    onPress={() => setSubcategory(sub)}
                  >
                    <Text style={styles.subCatText}>{sub.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>NOTE (OPTIONAL)</Text>
              <View style={styles.noteInputBox}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Para saan ito?"
                  value={note}
                  onChangeText={setNote}
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Check size={28} color={COLORS.black} strokeWidth={4} />
              <Text style={styles.saveButtonText}>I-SAVE ANG GASTOS</Text>
            </TouchableOpacity>
            
            <View style={{ height: 100 }} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.black,
  },
  closeBtn: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.secondary,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 16,
    borderWidth: 4,
    borderTopWidth: 0,
    borderColor: COLORS.black,
    minHeight: '100%',
  },
  amountSection: {
    marginBottom: 40,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: 1,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.black,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  currency: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.black,
    marginRight: 12,
  },
  amountInput: {
    fontSize: 54,
    fontWeight: '900',
    color: COLORS.black,
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  catBtn: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.black,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  catBtnActive: {
    backgroundColor: COLORS.accent,
  },
  catText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
  },
  subCatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subCatBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  subCatBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  subCatText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
  },
  noteInputBox: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  noteInput: {
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default AddExpenseModal;
