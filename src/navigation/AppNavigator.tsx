import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import { Register } from '../screens/Register';
import { UserSearch } from '../screens/UserSearch';
import { UserList } from '../screens/UserList';
import { UserDetails } from '../screens/UserDetails';

// Types
import { TabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente que contém as tabs
const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: colors.background,
          borderTopColor: 'rgba(0,0,0,0.05)',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          tabBarLabel: 'Cadastro',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={UserSearch}
        options={{
          tabBarLabel: 'Pesquisar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={UserList}
        options={{
          tabBarLabel: 'Listar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen 
          name="UserDetails" 
          component={UserDetails}
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 