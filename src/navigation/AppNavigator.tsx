import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../components/theme';

import PeliculasScreen from '../screens/PeliculasScreen';
import HistorialScreen from '../screens/HistorialScreen';
import DashboardScreen from '../screens/staff';
import MapaAsientosScreen from '../screens/MapaAsientosScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Configuramos las pestañas (Solo los 3 botones visibles)
function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0c0e13',
                    borderTopColor: theme.colors.surfaceContainerHigh,
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                tabBarLabelStyle: {
                    fontFamily: theme.fonts.mono,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }
            }}
        >
            <Tab.Screen
                name="Cartelera"
                component={PeliculasScreen}
                options={{ tabBarIcon: ({ color, size }) => <Ionicons name="film-outline" size={size} color={color} /> }}
            />
            <Tab.Screen
                name="Mis Boletos"
                component={HistorialScreen}
                options={{ tabBarIcon: ({ color, size }) => <Ionicons name="ticket-outline" size={size} color={color} /> }}
            />
            <Tab.Screen
                name="Zona Staff"
                component={DashboardScreen}
                options={{ tabBarIcon: ({ color, size }) => <Ionicons name="id-card-outline" size={size} color={color} /> }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen name="MapaAsientosScreen" component={MapaAsientosScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}