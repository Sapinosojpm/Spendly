import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Calendar } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const PaydayCountdown = ({ paydayInfo }) => {
  const { daysUntil, isDelikado } = paydayInfo;

  // Calculate progress (assuming 15-day cycle for visualization)
  const progress = Math.max(0, Math.min(100, ((15 - daysUntil) / 15) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={20} color={COLORS.black} strokeWidth={3} />
        <Text style={styles.headerTitle}>PAYDAY COUNTDOWN</Text>
      </View>
      
      <View style={[styles.card, isDelikado && styles.delikadoCard]}>
        <View style={styles.contentRow}>
          <View>
            <Text style={styles.label}>DAYS UNTIL SAHOD</Text>
            <Text style={styles.value}>{daysUntil} na araw</Text>
          </View>
          
          {isDelikado && (
            <View style={styles.badge}>
              <AlertTriangle size={18} color={COLORS.danger} strokeWidth={3} />
              <Text style={styles.badgeText}>DELIKADO!</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {isDelikado ? "KAPIT LANG, IDOL!" : `${Math.round(progress)}% of the way there!`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
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
  delikadoCard: {
    backgroundColor: COLORS.primary, // Changed to primary yellow for high visibility
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 4,
    opacity: 0.8,
  },
  value: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  badge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
  },
  progressContainer: {
    height: 16,
    backgroundColor: '#EEE',
    borderWidth: 3,
    borderColor: COLORS.black,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
    opacity: 0.7,
    textAlign: 'right',
  },
});

export default PaydayCountdown;
