import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';
import PaydayCountdown from '../components/PaydayCountdown';
import TipidHack from '../components/TipidHack';
import MotivationalQuote from '../components/MotivationalQuote';

import { 
  Trophy, 
  Target, 
  Flame, 
  Palmtree, 
  Smartphone, 
  ShieldCheck,
  Zap
} from 'lucide-react-native';

const VibeScreen = () => {
  const { 
    getPaydayInfo, 
    getDailyHack, 
    getMotivationalQuote 
  } = useBudgetStore();
  
  const paydayInfo = getPaydayInfo();
  const dailyHack = getDailyHack();
  const dailyQuote = getMotivationalQuote();

  const achievements = [
    { id: 1, icon: <Flame size={24} color={COLORS.black} />, label: "7-DAY STREAK", color: COLORS.primary },
    { id: 2, icon: <ShieldCheck size={24} color={COLORS.black} />, label: "EMERGENCY READY", color: COLORS.accent },
    { id: 3, icon: <Zap size={24} color={COLORS.black} />, label: "FAST SAVER", color: COLORS.secondary },
  ];

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Mega Header */}
          <View style={styles.megaHeader}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>IPON HUB</Text>
            </View>
            <Text style={styles.subtitle}>ANG IYONG FINANCIAL FUEL.</Text>
          </View>

          <PaydayCountdown paydayInfo={paydayInfo} />
          
          {/* Pangarap Meter Section */}
          <View style={styles.sectionHeader}>
            <Target size={20} color={COLORS.black} strokeWidth={3} />
            <Text style={styles.sectionTitle}>PANGARAP METER</Text>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalInfo}>
              <View style={styles.goalIconBox}>
                <Palmtree size={32} color={COLORS.black} />
              </View>
              <View>
                <Text style={styles.goalName}>BORACAY FUND 🏝️</Text>
                <Text style={styles.goalProgress}>₱15,000 / ₱25,000</Text>
              </View>
            </View>
            <View style={styles.mainProgressContainer}>
              <View style={[styles.mainProgressBar, { width: '60%' }]} />
            </View>
            <Text style={styles.goalHint}>Onti na lang, makaka-bakasyon ka na!</Text>
          </View>

          {/* Daily Inspiration */}
          <View style={styles.divider}>
            <Text style={styles.dividerText}>DAILY BOOST</Text>
          </View>

          <MotivationalQuote quote={dailyQuote} />
          <TipidHack hack={dailyHack} />
          
          {/* Achievements Section */}
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={COLORS.black} strokeWidth={3} />
            <Text style={styles.sectionTitle}>IPON MILESTONES</Text>
          </View>

          <View style={styles.achievementGrid}>
            {achievements.map((item) => (
              <View key={item.id} style={[styles.achievementBadge, { backgroundColor: item.color }]}>
                {item.icon}
                <Text style={styles.badgeLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.methodology}>
            <Text style={styles.methodTitle}>TANDAAN, IDOL!</Text>
            <Text style={styles.methodText}>
              Ang bawat sentimong natitipid mo ngayon ay investment para sa iyong mas maginhawang bukas. Disiplina ang susi sa tunay na kalayaan!
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
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
  megaHeader: {
    marginBottom: 32,
  },
  titleBox: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignSelf: 'flex-start',
    transform: [{ rotate: '-2deg' }],
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 1,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginBottom: 32,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  goalIconBox: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.black,
    opacity: 0.6,
  },
  mainProgressContainer: {
    height: 24,
    backgroundColor: '#EEE',
    borderWidth: 3,
    borderColor: COLORS.black,
    marginBottom: 12,
  },
  mainProgressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  goalHint: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.black,
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 4,
    opacity: 0.5,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  achievementBadge: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 8,
  },
  methodology: {
    backgroundColor: COLORS.secondary,
    padding: 24,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  methodTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '800',
  },
});

export default VibeScreen;
