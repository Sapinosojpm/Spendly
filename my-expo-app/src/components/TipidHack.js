import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const TipidHack = ({ hack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap size={20} color={COLORS.black} strokeWidth={3} />
        <Text style={styles.headerTitle}>TIPID HACK OF THE DAY</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.hackText}>"{hack.toUpperCase()}"</Text>
        
        <TouchableOpacity style={styles.tryBtn} activeOpacity={0.7}>
          <Text style={styles.tryBtnText}>SUSUBUKAN KO 'TO!</Text>
          <ChevronRight size={18} color={COLORS.black} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 1,
  },
  card: {
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
  hackText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    lineHeight: 26,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  tryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tryBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
  },
});

export default TipidHack;
