import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Home, Wallet, TrendingUp, Sparkles, User, MessageSquare } from 'lucide-react-native';
import useTheme from '../utils/useTheme';

const { width } = Dimensions.get('window');

const BrutalistTabBar = ({ state, descriptors, navigation }) => {
  const C = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: C.card, borderColor: C.border, shadowColor: C.shadow }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const iconColor = isFocused ? '#000' : C.text;
          const size = 20;
          const sw = 3;

          const renderIcon = () => {
            switch (route.name) {
              case 'Home':     return <Home         size={size} color={iconColor} strokeWidth={sw} />;
              case 'Reports':  return <Wallet        size={size} color={iconColor} strokeWidth={sw} />;
              case 'Insights': return <Sparkles      size={size} color={iconColor} strokeWidth={sw} />;
              case 'Kausap':   return <MessageSquare size={size} color={iconColor} strokeWidth={sw} />;
              case 'Profile':  return <User          size={size} color={iconColor} strokeWidth={sw} />;
              case 'IPON': return (
                <View style={styles.iponContainer}>
                  <View style={[
                    styles.iponBox,
                    { borderColor: C.border, shadowColor: C.shadow },
                    isFocused
                      ? { backgroundColor: C.primary, shadowOpacity: 1 }
                      : { backgroundColor: 'transparent', shadowOpacity: 0, borderColor: 'transparent' },
                  ]}>
                    <TrendingUp size={24} color={C.text} strokeWidth={4} />
                  </View>
                </View>
              );
              default: return null;
            }
          };

          if (route.name === 'IPON') {
            return (
              <TouchableOpacity key={route.key} onPress={onPress} style={styles.iponTab} activeOpacity={0.7}>
                {renderIcon()}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && { backgroundColor: C.primary, borderColor: C.border, borderWidth: 3 },
              ]}
              activeOpacity={0.7}
            >
              {renderIcon()}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginHorizontal: 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  iponTab:       { flex: 1.1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  iponContainer: { alignItems: 'center' },
  iponBox: {
    width: 54, height: 44, borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 3, height: 3 }, shadowRadius: 0, elevation: 0,
  },
});

export default BrutalistTabBar;
