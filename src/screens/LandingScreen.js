import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  FadeInRight,
  FadeIn
} from 'react-native-reanimated';
import { 
  Zap, 
  Brain, 
  BarChart2, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react-native';
import { COLORS } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import GridBackground from '../components/GridBackground';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  // Guard against undefined icons
  if (!Icon) return null;
  
  return (
    <Animated.View 
      entering={FadeInRight.delay(800 + (index * 150)).duration(600)}
      style={styles.featureCard}
    >
      <View style={styles.iconBox}>
        <Icon size={32} color={COLORS.black} strokeWidth={3} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title.toUpperCase()}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const QUOTES = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "It’s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "The goal is not to look rich. The goal is to be rich.", author: "Anonymous" }
];

const LandingScreen = ({ navigation }) => {
  const isOnboarded = useBudgetStore((state) => !!state.isOnboarded);
  const [quote] = React.useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const handlePress = () => {
    if (isOnboarded) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Onboarding');
    }
  };

  return (
    <GridBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.hero}>
            <Text style={styles.appName}>SPENDLY</Text>
            <Text style={styles.heroTitle}>Ayusin ang Pera,</Text>
            <Text style={[styles.heroTitle, { color: COLORS.secondary }]}>Bawas Stress.</Text>
            
            <Animated.View entering={FadeInDown.delay(500).duration(1000)} style={styles.quoteCard}>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author.toUpperCase()}</Text>
            </Animated.View>
          </Animated.View>

          <View style={styles.featuresSection}>
            <Animated.Text 
              entering={FadeIn.delay(700)}
              style={styles.sectionLabel}
            >
              Power Features
            </Animated.Text>
            
            <FeatureCard 
              index={0}
              icon={Zap}
              title="Mabilisang Pag-lista"
              description="I-log ang gastos sa loob ng ilang segundo. Simple at mabilis."
            />
            
            <FeatureCard 
              index={1}
              icon={Brain}
              title="AI Insights"
              description="Mga smart predictions at trends base sa iyong spending habits."
            />
            
            <FeatureCard 
              index={2}
              icon={BarChart2}
              title="Premium Reports"
              description="Magagandang charts at weekly deep-dives sa iyong finances."
            />
            
            <FeatureCard 
              index={3}
              icon={ShieldCheck}
              title="50/30/20 Rule"
              description="Isang proven budgeting method na naka-built in na sa app."
            />
          </View>

          <Animated.View 
            entering={FadeInUp.delay(1500)}
            style={styles.methodology}
          >
            <Text style={styles.methodTitle}>SMART BUDGETING</Text>
            <Text style={styles.methodText}>
              Tutulungan ka naming i-balance ang buhay gamit ang 50/30/20 rule: 50% para sa Needs, 30% para sa Wants, at 20% para sa iyong Ipon.
            </Text>
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <Animated.View 
          entering={FadeInDown.delay(1800)}
          style={styles.footer}
        >
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.9}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>
              {isOnboarded ? 'PUMUNTA SA HOME' : 'SIMULAN NA NATIN'}
            </Text>
            <ChevronRight size={24} color={COLORS.black} strokeWidth={3} />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </GridBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 30,
  },
  hero: {
    marginBottom: 48,
  },
  appName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 8,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.black,
    lineHeight: 52,
    letterSpacing: -2,
    textTransform: 'uppercase',
  },
  quoteCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: COLORS.black,
    marginTop: 32,
    shadowColor: COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  quoteText: {
    fontSize: 18,
    color: COLORS.black,
    lineHeight: 26,
    fontWeight: '800',
  },
  quoteAuthor: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 12,
    fontWeight: '900',
    textAlign: 'right',
    letterSpacing: 1,
  },
  featuresSection: {
    gap: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 12,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 22,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderWidth: 3,
    borderColor: COLORS.black,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    fontWeight: '700',
  },
  methodology: {
    marginTop: 48,
    backgroundColor: COLORS.secondary,
    padding: 32,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  methodTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 12,
  },
  methodText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderWidth: 4,
    borderColor: COLORS.black,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '900',
    marginRight: 10,
    letterSpacing: 1,
  },
});

export default LandingScreen;
