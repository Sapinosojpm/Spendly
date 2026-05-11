import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { CATEGORIES } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';
import GridBackground from '../components/GridBackground';

const AddExpenseModal = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [subcategory, setSubcategory] = useState(CATEGORIES['Bills'][0]);
  const [note, setNote] = useState('');

  const addExpense = useBudgetStore((state) => state.addExpense);
  const C = useTheme();

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Mag-enter po ng tamang halaga.');
      return;
    }
    addExpense({ amount: parseFloat(amount), category, subcategory, note });
    navigation.goBack();
  };

  const changeCategory = (cat) => {
    setCategory(cat);
    setSubcategory(CATEGORIES[cat][0]);
  };

  const S = useMemo(() => StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 20, backgroundColor: C.card,
      borderBottomWidth: 4, borderBottomColor: C.border,
    },
    closeBtn: {
      width: 54, height: 54, backgroundColor: C.secondary,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    headerTitle: { fontSize: 22, fontWeight: '900', color: C.text, letterSpacing: 2 },
    scrollContent: {
      padding: 24,
      backgroundColor: C.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
      marginHorizontal: 16, borderWidth: 4, borderTopWidth: 0,
      borderColor: C.border, minHeight: '100%',
    },
    amountSection: { marginBottom: 40, marginTop: 20 },
    label: { fontSize: 14, fontWeight: '900', color: C.text, marginBottom: 16, letterSpacing: 1 },
    amountInputBox: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: C.primary, borderWidth: 4, borderColor: C.border, padding: 24,
      shadowColor: C.shadow, shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0,
    },
    currency:    { fontSize: 42, fontWeight: '900', color: '#000', marginRight: 12 },
    amountInput: { fontSize: 54, fontWeight: '900', color: '#000', flex: 1 },
    section:     { marginBottom: 32 },
    categoryGrid: { flexDirection: 'row', gap: 12 },
    catBtn: {
      flex: 1, paddingVertical: 16, backgroundColor: C.card, borderWidth: 3, borderColor: C.border,
      alignItems: 'center', shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    catBtnActive: { backgroundColor: C.accent },
    catText: { fontSize: 14, fontWeight: '900', color: C.text },
    subCatContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    subCatBtn: {
      paddingHorizontal: 16, paddingVertical: 10,
      backgroundColor: C.card, borderWidth: 2, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0,
    },
    subCatBtnActive: { backgroundColor: C.secondary },
    subCatText: { fontSize: 12, fontWeight: '900', color: C.text },
    noteInputBox: {
      backgroundColor: C.card, borderWidth: 3, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    noteInput: { padding: 16, fontSize: 16, fontWeight: '700', color: C.text },
    saveButton: {
      backgroundColor: C.primary, padding: 18, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', gap: 12, borderWidth: 4, borderColor: C.border,
      shadowColor: C.shadow, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0,
      marginTop: 20,
    },
    saveButtonText: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  }), [C]);

  return (
    <GridBackground>
      <SafeAreaView style={S.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={S.header}>
            <TouchableOpacity style={S.closeBtn} onPress={() => navigation.goBack()}>
              <X size={28} color="#000" strokeWidth={3} />
            </TouchableOpacity>
            <Text style={S.headerTitle}>BAGONG GASTOS</Text>
            <View style={{ width: 54 }} />
          </View>

          <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={S.amountSection}>
              <Text style={S.label}>MAGKANO ANG GASTOS?</Text>
              <View style={S.amountInputBox}>
                <Text style={S.currency}>₱</Text>
                <TextInput
                  style={S.amountInput}
                  placeholder="0"
                  keyboardType="numeric"
                  autoFocus
                  value={amount}
                  onChangeText={setAmount}
                  placeholderTextColor="rgba(0,0,0,0.4)"
                />
              </View>
            </View>

            <View style={S.section}>
              <Text style={S.label}>SAAN IBABAWAS?</Text>
              <View style={S.categoryGrid}>
                {Object.keys(CATEGORIES).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[S.catBtn, category === cat && S.catBtnActive]}
                    onPress={() => changeCategory(cat)}
                  >
                    <Text style={S.catText}>
                      {cat === 'Bills' ? 'BAYARIN' : cat === 'Wants' ? 'WANTS' : 'IPON'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={S.section}>
              <Text style={S.label}>URI NG GASTOS</Text>
              <View style={S.subCatContainer}>
                {CATEGORIES[category].map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    style={[S.subCatBtn, subcategory === sub && S.subCatBtnActive]}
                    onPress={() => setSubcategory(sub)}
                  >
                    <Text style={S.subCatText}>{sub.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={S.section}>
              <Text style={S.label}>NOTE (OPTIONAL)</Text>
              <View style={S.noteInputBox}>
                <TextInput
                  style={S.noteInput}
                  placeholder="Para saan ito?"
                  value={note}
                  onChangeText={setNote}
                  placeholderTextColor={C.textMuted}
                />
              </View>
            </View>

            <TouchableOpacity style={S.saveButton} onPress={handleSave}>
              <Check size={28} color="#000" strokeWidth={4} />
              <Text style={S.saveButtonText}>I-SAVE ANG GASTOS</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GridBackground>
  );
};

export default AddExpenseModal;
