import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Home, Wallet, TrendingUp, Sparkles, User } from 'lucide-react-native';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

const BrutalistTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const renderIcon = () => {
            const size = 24;
            const color = COLORS.black;
            const strokeWidth = 3;

            switch (route.name) {
              case 'Home': return <Home size={size} color={color} strokeWidth={strokeWidth} />;
              case 'Reports': return <Wallet size={size} color={color} strokeWidth={strokeWidth} />;
              case 'IPON': return (
                <View style={styles.iponContainer}>
                  <View style={[styles.iponBox, { backgroundColor: isFocused ? COLORS.primary : COLORS.white }]}>
                    <TrendingUp size={28} color={COLORS.black} strokeWidth={4} />
                  </View>
                  <Text style={styles.iponLabel}>IPON</Text>
                </View>
              );
              case 'Insights': return <Sparkles size={size} color={color} strokeWidth={strokeWidth} />;
              case 'Profile': return <User size={size} color={color} strokeWidth={strokeWidth} />;
              default: return null;
            }
          };

          if (route.name === 'IPON') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.iponTab}
                activeOpacity={0.7}
              >
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
                isFocused && styles.tabItemActive
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: 85,
    borderWidth: 4,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginHorizontal: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.black,
  },
  iponTab: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iponContainer: {
    alignItems: 'center',
  },
  iponBox: {
    width: 60,
    height: 50,
    borderWidth: 3,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  iponLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.black,
  },
});

export default BrutalistTabBar;
