import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import GalleryScreen from './src/screens/GalleryScreen';
import AddImageScreen from './src/screens/AddImageScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function RootTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Gallery" component={GalleryScreen} />
      <Tabs.Screen name="Add" component={AddImageScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Root" component={RootTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}
