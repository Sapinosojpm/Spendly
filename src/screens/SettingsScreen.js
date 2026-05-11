import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Palette,
  CheckCircle2,
  ChevronLeft,
  Settings,
  Info
} from 'lucide-react-native';
import useBudgetStore from '../store/useBudgetStore';
import { THEMES, THEME_ORDER } from '../utils/themes';
import useTheme from '../utils/useTheme';
import GridBackground from '../components/GridBackground';

// ─── Theme Swatch Card ────────────────────────────────────────────────────────
const ThemeSwatch = ({ theme, isActive, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(theme.id)}
      activeOpacity={0.85}
      style={[
        swatchStyles.card,
        {
          backgroundColor: theme.background,
          borderColor: isActive ? theme.primary : '#000',
          borderWidth: isActive ? 4 : 2.5,
          shadowColor: isActive ? theme.primary : '#000',
        },
      ]}
    >
      <View style={swatchStyles.stripRow}>
        <View style={[swatchStyles.strip, { backgroundColor: theme.primary }]} />
        <View style={[swatchStyles.strip, { backgroundColor: theme.secondary }]} />
        <View style={[swatchStyles.strip, { backgroundColor: theme.accent }]} />
      </View>
      <Text style={swatchStyles.emoji}>{theme.emoji}</Text>
      <Text style={[swatchStyles.name, { color: theme.text }]}>{theme.name}</Text>
      {isActive && (
        <View style={[swatchStyles.checkBadge, { backgroundColor: theme.primary }]}>
          <CheckCircle2 size={14} color="#000" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const swatchStyles = StyleSheet.create({
  card: {
    width: '30%',
    padding: 12,
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    position: 'relative',
    marginBottom: 10,
  },
  stripRow: { flexDirection: 'row', gap: 3, marginBottom: 8, width: '100%', height: 8 },
  strip: { flex: 1, height: 8, borderRadius: 1, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  emoji: { fontSize: 22, marginBottom: 4 },
  name: { fontSize: 9, fontWeight: '900', textAlign: 'center', letterSpacing: 0.5 },
  checkBadge: { position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
});

const SettingsScreen = ({ navigation }) => {
  const { themeId, setTheme } = useBudgetStore();
  const C = useTheme();

  const S = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 4,
      borderBottomColor: '#000',
      backgroundColor: C.card,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: '#000',
      marginLeft: 12,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 20,
    },
    sectionCard: {
      backgroundColor: C.card,
      padding: 20,
      borderWidth: 4,
      borderColor: '#000',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: '#000',
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 4,
    },
    themeLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: '#666',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 2,
      borderBottomColor: '#EEE',
    },
    infoLabel: { fontWeight: '800', fontSize: 14, color: '#000' },
    infoValue: { fontWeight: '900', fontSize: 14, color: C.primary },
  }), [C]);

  return (
    <GridBackground>
      <SafeAreaView style={S.safeArea}>
        <StatusBar style="dark" />
        
        <View style={S.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={30} color="#000" strokeWidth={3} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>SETTINGS</Text>
        </View>

        <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ── 🎨 THEME PICKER ── */}
          <View style={S.sectionCard}>
            <View style={S.sectionHeader}>
              <Palette size={20} color={C.primary} strokeWidth={3} />
              <Text style={S.sectionTitle}>TEMA NG APP</Text>
            </View>
            <Text style={S.themeLabel}>Baguhin ang kulay ng iyong Spendly experience:</Text>
            <View style={S.themeGrid}>
              {THEME_ORDER.map((id) => (
                <ThemeSwatch
                  key={id}
                  theme={THEMES[id]}
                  isActive={themeId === id}
                  onSelect={setTheme}
                />
              ))}
            </View>
          </View>

          {/* ── ℹ️ APP INFO ── */}
          <View style={S.sectionCard}>
            <View style={S.sectionHeader}>
              <Info size={20} color={C.primary} strokeWidth={3} />
              <Text style={S.sectionTitle}>APP INFO</Text>
            </View>
            <View style={S.infoRow}>
              <Text style={S.infoLabel}>Version</Text>
              <Text style={S.infoValue}>1.0.0 (Beta)</Text>
            </View>
            <View style={S.infoRow}>
              <Text style={S.infoLabel}>Language</Text>
              <Text style={S.infoValue}>Taglish 🇵🇭</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </GridBackground>
  );
};

export default SettingsScreen;
