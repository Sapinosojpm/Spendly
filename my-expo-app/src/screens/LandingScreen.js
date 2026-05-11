import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated as RNAnimated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {
  Zap,
  Brain,
  BarChart2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Coins,
  Flame,
  Star,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import GridBackground from '../components/GridBackground';
import useTheme from '../utils/useTheme';
import useBudgetStore from '../store/useBudgetStore';

const { width, height } = Dimensions.get('window');

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ end, prefix = '', suffix = '', duration = 1500, numberStyle }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <Text style={[styles.statNumber, numberStyle]}>{prefix}{count.toLocaleString()}{suffix}</Text>;
};

// ─── Floating Orb ─────────────────────────────────────────────────────────────
const FloatingOrb = ({ color, size, top, left, delay = 0 }) => {
  const translateY = useSharedValue(0);
  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-14, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,   { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ), -1, true
    ));
  }, []);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return (
    <Animated.View style={[{ position: 'absolute', top, left }, animStyle]} pointerEvents="none">
      <View style={{
        width: size, height: size,
        backgroundColor: color,
        borderRadius: size * 0.28,
        opacity: 0.20,
        borderWidth: 2.5,
        borderColor: '#000',
      }} />
    </Animated.View>
  );
};

// ─── Pulse Ring ───────────────────────────────────────────────────────────────
const PulseRing = ({ color, size, delay = 0 }) => {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  useEffect(() => {
    scale.value   = withDelay(delay, withRepeat(withTiming(1.65, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false));
    opacity.value = withDelay(delay, withRepeat(withTiming(0,    { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false));
  }, []);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.View pointerEvents="none" style={[{
      position: 'absolute',
      width: size, height: size,
      borderRadius: size / 2,
      borderWidth: 2.5,
      borderColor: color,
    }, animStyle]} />
  );
};

// ─── Feature Chip (horizontal scroll) ────────────────────────────────────────
const FEATURES = [
  { icon: Zap,         title: 'Instant Log',   bg: COLORS.primary,   fg: '#000' },
  { icon: Brain,       title: 'AI Coach',       bg: '#111',           fg: COLORS.primary },
  { icon: BarChart2,   title: 'Deep Reports',   bg: COLORS.accent,    fg: '#000' },
  { icon: ShieldCheck, title: '50/30/20',       bg: COLORS.secondary, fg: '#000' },
  { icon: Star,        title: '4.9 Rating',     bg: '#fff',           fg: '#000' },
  { icon: Flame,       title: 'Trending PH',    bg: '#FF4D4D',        fg: '#fff' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const LandingScreen = ({ navigation }) => {
  const isOnboarded = useBudgetStore((state) => !!state.isOnboarded);
  const C = useTheme();

  // Pulsing CTA
  const ctaScale = useRef(new RNAnimated.Value(1)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(ctaScale, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        RNAnimated.timing(ctaScale, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Update badge glow color when theme changes — handled by inline style

  // Bouncing arrow
  const arrowY = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(arrowY, { toValue: 6,  duration: 700, useNativeDriver: true }),
        RNAnimated.timing(arrowY, { toValue: 0,  duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    if (isOnboarded) navigation.navigate('Main');
    else navigation.navigate('Onboarding');
  };

  return (
    <GridBackground>
      <StatusBar barStyle={C.dark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />

      {/* ── Floating Orbs ── */}
      <FloatingOrb color={C.primary}   size={160} top={-50}           left={width - 110} delay={0}   />
      <FloatingOrb color={C.accent}    size={110} top={height * 0.38} left={-45}         delay={350} />
      <FloatingOrb color={C.secondary} size={80}  top={height * 0.65} left={width - 70}  delay={600} />

      <SafeAreaView style={styles.safeArea}>

        {/* ═══════════════════════════════════════════════════════
            ABOVE THE FOLD — always visible, no scroll needed
            ═══════════════════════════════════════════════════════ */}

        {/* Badge */}
        <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.badgeRow}>
          <View style={[styles.badge, { borderColor: C.primary, shadowColor: C.primary }]}>
            <Sparkles size={12} color={C.primary} strokeWidth={3} />
            <Text style={[styles.badgeText, { color: C.primary }]}>  PINAKA-MATALINONG BUDGET APP  </Text>
            <Sparkles size={12} color={C.primary} strokeWidth={3} />
          </View>
        </Animated.View>

        {/* Hero Visual + Text */}
        <Animated.View entering={FadeInUp.delay(200).duration(650)} style={styles.heroSection}>
          {/* Icon */}
          <View style={styles.heroIconWrapper}>
            <PulseRing color={C.primary} size={100} delay={0}   />
            <PulseRing color={C.accent}  size={100} delay={700} />
            <View style={[styles.heroIconCore, { backgroundColor: C.primary }]}>
              <Coins size={36} color="#000" strokeWidth={2.5} />
            </View>

            {/* Mini floating badges */}
            <Animated.View entering={SlideInRight.delay(800).duration(450)} style={[styles.miniBadge, { top: -8, right: -60 }]}>
              <Text style={styles.miniBadgeText}>+₱500 saved! 🎉</Text>
            </Animated.View>
            <Animated.View entering={SlideInLeft.delay(1000).duration(450)} style={[styles.miniBadge, { bottom: -8, left: -60, backgroundColor: C.accent }]}>
              <Text style={styles.miniBadgeText}>🔥 7-day streak</Text>
            </Animated.View>
          </View>

          {/* Copy */}
          <Text style={styles.appName}>SPENDLY</Text>
          <Text style={styles.heroLine1}>Kontrolin</Text>
          <View style={styles.heroHighlightRow}>
            <View style={[styles.heroHighlight, { backgroundColor: C.primary }]}>
              <Text style={styles.heroHighlightText}>Ang Pera.</Text>
            </View>
          </View>
          <Text style={styles.heroSub}>
            AI financial coach na nagsasalita ng Taglish. 💬
          </Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={ZoomIn.delay(550).duration(550)} style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: C.primary }]}>
            <AnimatedCounter end={638} suffix="+" duration={1100} />
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111' }]}>
            <AnimatedCounter end={97} suffix="%" duration={900} numberStyle={{ color: C.primary }} />
            <Text style={[styles.statLabel, { color: C.primary }]}>Budget Hit</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: C.accent }]}>
            <Text style={styles.statNumber}>{'<5s'}</Text>
            <Text style={styles.statLabel}>Mag-log</Text>
          </View>
        </Animated.View>

        {/* ═══════════════════════════════════════════════════════
            CTA BUTTON — always pinned, always visible
            ═══════════════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(700).duration(650)} style={styles.ctaSection}>
          <RNAnimated.View style={{ transform: [{ scale: ctaScale }] }}>
            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: C.primary }]} activeOpacity={0.8} onPress={handlePress}>
              <TrendingUp size={22} color="#000" strokeWidth={3} />
              <Text style={styles.ctaText}>
                {isOnboarded ? 'BUMALIK SA APP' : 'SIMULAN NA NATIN'}
              </Text>
              <ArrowRight size={22} color="#000" strokeWidth={3} />
            </TouchableOpacity>
          </RNAnimated.View>
          <Text style={styles.ctaNote}>⚡ Free · Walang Ads · Ikaw ang Boss</Text>
        </Animated.View>

        {/* ═══════════════════════════════════════════════════════
            SCROLL DOWN — Features chip strip
            ═══════════════════════════════════════════════════════ */}
        <Animated.View entering={FadeIn.delay(1000).duration(500)} style={styles.moreSection}>
          <RNAnimated.View style={{ transform: [{ translateY: arrowY }], alignItems: 'center' }}>
            <ChevronDown size={16} color="#999" strokeWidth={3} />
          </RNAnimated.View>
          <Text style={styles.moreLabel}>Swipe para sa features</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipTrack}
            style={styles.chipScroll}
          >
            {FEATURES.map((f, i) => (
              <Animated.View
                key={f.title}
                entering={SlideInRight.delay(1100 + i * 80).duration(400)}
                style={[styles.chip, { backgroundColor: f.bg }]}
              >
                <f.icon size={15} color={f.fg} strokeWidth={2.5} />
                <Text style={[styles.chipText, { color: f.fg }]}>{f.title}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

      </SafeAreaView>
    </GridBackground>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 6,
    justifyContent: 'space-between',
  },

  // Badge
  badgeRow: { alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
  },
  heroIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginBottom: 14,
  },
  heroIconCore: {
    position: 'absolute',
    width: 68,
    height: 68,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  miniBadge: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderWidth: 2.5,
    borderColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 9,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  appName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 12,
    opacity: 0.3,
    marginBottom: 4,
  },
  heroLine1: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000',
    lineHeight: 56,
    letterSpacing: -2,
    textAlign: 'center',
  },
  heroHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroHighlight: {
    backgroundColor: COLORS.primary,
    borderWidth: 3.5,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  heroHighlightText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000',
    lineHeight: 62,
    letterSpacing: -2,
  },
  heroSub: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginTop: 3,
    opacity: 0.7,
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
    width: '100%',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1.5,
  },
  ctaNote: {
    marginTop: 10,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
  },

  // More / scroll
  moreSection: {
    alignItems: 'center',
    paddingBottom: 6,
  },
  moreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#bbb',
    letterSpacing: 1,
    marginBottom: 8,
  },
  chipScroll: {
    width: '100%',
  },
  chipTrack: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
});

export default LandingScreen;
