import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import "./global.css";
import OnboardingScreen from './src/screens/OnboardingScreen';
import LandingScreen from './src/screens/LandingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddExpenseModal from './src/screens/AddExpenseModal';
import ReportsScreen from './src/screens/ReportsScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import VibeScreen from './src/screens/VibeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import useBudgetStore from './src/store/useBudgetStore';
import BrutalistTabBar from './src/components/BrutalistTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// const ProfilePlaceholder deleted as we now have ProfileScreen

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BrutalistTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="IPON" component={VibeScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const isOnboarded = useBudgetStore((state) => !!state.isOnboarded);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
          initialRouteName="Landing"
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          {!isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen 
                name="AddExpense" 
                component={AddExpenseModal} 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
                }} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
