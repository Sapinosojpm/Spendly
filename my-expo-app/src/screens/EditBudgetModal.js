import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import useTheme from '../utils/useTheme';
import useBudgetStore from '../store/useBudgetStore';

const EditBudgetModal = ({ navigation }) => {
  const C = useTheme();
  const { allocations, setAllocations } = useBudgetStore();

  const [localAllocations, setLocalAllocations] = useState({
    Bills: allocations.Bills.toString(),
    Wants: allocations.Wants.toString(),
    Savings: allocations.Savings.toString(),
  });

  const total = 
    (parseInt(localAllocations.Bills) || 0) + 
    (parseInt(localAllocations.Wants) || 0) + 
    (parseInt(localAllocations.Savings) || 0);

  const isValid = total === 100;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Mali ang Total', `Ang total ay dapat saktong 100%. Sa ngayon ang total mo ay ${total}% lodi.`);
      return;
    }
    
    setAllocations({
      Bills: parseInt(localAllocations.Bills),
      Wants: parseInt(localAllocations.Wants),
      Savings: parseInt(localAllocations.Savings),
    });
    
    navigation.goBack();
  };

  const S = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: C.card,
      borderWidth: 5,
      borderColor: C.border,
      padding: 24,
      shadowColor: C.shadow,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: C.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '700',
      color: C.textMuted,
      marginBottom: 24,
    },
    inputSection: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '900',
      color: C.text,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: C.border,
      paddingHorizontal: 12,
      backgroundColor: C.cardAlt,
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 20,
      fontWeight: '900',
      color: C.text,
    },
    percentSign: {
      fontSize: 20,
      fontWeight: '900',
      color: C.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderWidth: 3,
      borderColor: isValid ? C.primary : '#FF4D4D',
      backgroundColor: isValid ? '#E8F5E9' : '#FFEBEE',
      marginBottom: 24,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '900',
      color: '#000',
    },
    totalValue: {
      fontSize: 24,
      fontWeight: '900',
      color: isValid ? '#2E7D32' : '#C62828',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    btn: {
      flex: 1,
      padding: 16,
      borderWidth: 3,
      borderColor: C.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    cancelBtn: { backgroundColor: '#FFF' },
    saveBtn: { 
      backgroundColor: C.primary,
      opacity: isValid ? 1 : 0.5,
    },
    btnText: {
      fontWeight: '900',
      fontSize: 16,
      color: '#000',
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={S.container}>
        <View style={S.card}>
          <Text style={S.title}>EDIT BUDGET RULE</Text>
          <Text style={S.subtitle}>Baguhin ang priority ng iyong pera. Dapat ang total ay 100% lodi.</Text>

          <View style={S.inputSection}>
            <Text style={S.inputLabel}>Mga Bayarin (Bills)</Text>
            <View style={S.inputWrapper}>
              <TextInput
                style={S.input}
                value={localAllocations.Bills}
                onChangeText={(v) => setLocalAllocations({ ...localAllocations, Bills: v })}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={S.percentSign}>%</Text>
            </View>
          </View>

          <View style={S.inputSection}>
            <Text style={S.inputLabel}>Lifestyle (Wants)</Text>
            <View style={S.inputWrapper}>
              <TextInput
                style={S.input}
                value={localAllocations.Wants}
                onChangeText={(v) => setLocalAllocations({ ...localAllocations, Wants: v })}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={S.percentSign}>%</Text>
            </View>
          </View>

          <View style={S.inputSection}>
            <Text style={S.inputLabel}>Ipon (Savings)</Text>
            <View style={S.inputWrapper}>
              <TextInput
                style={S.input}
                value={localAllocations.Savings}
                onChangeText={(v) => setLocalAllocations({ ...localAllocations, Savings: v })}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={S.percentSign}>%</Text>
            </View>
          </View>

          <View style={S.totalRow}>
            <Text style={S.totalLabel}>TOTAL PERCENTAGE:</Text>
            <Text style={S.totalValue}>{total}%</Text>
          </View>

          <View style={S.actions}>
            <TouchableOpacity 
              style={[S.btn, S.cancelBtn]} 
              onPress={() => navigation.goBack()}
            >
              <X size={20} color="#000" strokeWidth={3} />
              <Text style={S.btnText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[S.btn, S.saveBtn]} 
              onPress={handleSave}
              disabled={!isValid}
            >
              <Check size={20} color="#000" strokeWidth={3} />
              <Text style={S.btnText}>SAVE RULE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditBudgetModal;
