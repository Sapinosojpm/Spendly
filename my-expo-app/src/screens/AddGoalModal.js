import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Target, Wallet } from 'lucide-react-native';
import useBudgetStore from '../store/useBudgetStore';
import { COLORS } from '../utils/constants';

const AddGoalModal = ({ navigation }) => {
  const { goals, updateGoal } = useBudgetStore();
  const currentGoal = goals[0];

  const [name, setName] = useState(currentGoal?.name || '');
  const [target, setTarget] = useState(currentGoal?.target?.toString() || '');

  const handleSave = () => {
    if (!name || !target) return;
    
    updateGoal(currentGoal.id, {
      name: name,
      target: parseFloat(target)
    });
    
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>SET YOUR PANGARAP</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <X size={24} color={COLORS.black} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>ANONG PANGARAP NATIN? 🏝️</Text>
              <View style={styles.inputWrapper}>
                <Target size={20} color={COLORS.black} />
                <TextInput
                  style={styles.input}
                  placeholder="Hal: Boracay Fund, Bagong CP..."
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>

              <Text style={[styles.label, { marginTop: 24 }]}>MAGKANO ANG TARGET? 💰</Text>
              <View style={styles.inputWrapper}>
                <Wallet size={20} color={COLORS.black} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={target}
                  onChangeText={setTarget}
                />
              </View>

              <Text style={styles.hint}>
                Note: Ang progresso nito ay nakabase sa kabuuang "Savings" mo sa app.
              </Text>

              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>IPUNIN NA 'TO!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.black,
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.black,
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    fontStyle: 'italic',
  },
  saveBtn: {
    marginTop: 'auto',
    backgroundColor: COLORS.secondary,
    height: 70,
    borderWidth: 4,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 20,
  },
  saveBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
  },
});

export default AddGoalModal;
