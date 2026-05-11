import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { CheckCircle2, PartyPopper, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';

const { width } = Dimensions.get('window');

const SetupCompleteScreen = ({ navigation }) => {
  const setOnboarded = useBudgetStore((state) => state.setOnboarded);
  const income = useBudgetStore((state) => state.income);
  
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 100, easing: Easing.linear }),
        withTiming(5, { duration: 100, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleFinish = () => {
    setOnboarded(true);
  };

  return (
    <GridBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View entering={ZoomIn.duration(800)} style={styles.iconContainer}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <PartyPopper size={64} color={COLORS.black} strokeWidth={2.5} />
              </View>
            </View>
            <Animated.View style={[styles.badge, animatedStyle]}>
              <Text style={styles.badgeText}>HANDA NA!</Text>
            </Animated.View>
          </Animated.View>

          <View style={styles.textSection}>
            <Animated.Text entering={FadeInUp.delay(300).duration(600)} style={styles.title}>
              ALL SET, LODI!
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(500).duration(600)} style={styles.subtitle}>
              Nai-set na namin ang iyong budget based sa income mong ₱{income.toLocaleString()}.
            </Animated.Text>
          </View>

          <View style={styles.summaryContainer}>
            <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.summaryItem}>
              <ShieldCheck size={20} color={COLORS.black} />
              <Text style={styles.summaryText}>50/30/20 Rule Applied</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(850).duration(500)} style={styles.summaryItem}>
              <Sparkles size={20} color={COLORS.black} />
              <Text style={styles.summaryText}>AI Coach Activated</Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(1100).duration(600)} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>PUMUNTA SA DASHBOARD</Text>
              <ArrowRight size={24} color={COLORS.black} strokeWidth={3} />
            </TouchableOpacity>
            <Text style={styles.hint}>Pwede mong baguhin ang budget anytime sa Settings.</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuter: {
    width: 140,
    height: 140,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  iconInner: {
    width: 110,
    height: 110,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -15,
    right: -20,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '950',
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 52,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 60,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderWidth: 3,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.black,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 4,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 1,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
    opacity: 0.5,
  }
});

export default SetupCompleteScreen;
