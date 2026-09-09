import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../components/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: 'rgba(12, 14, 19, 0.95)', 
          borderTopColor: theme.colors.surfaceContainerHigh,
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
          marginTop: 4,
        }
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Cartelera',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="boletos"
        options={{
          title: 'Mis Boletos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="staff"
        options={{
          title: 'Zona Staff',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="id-card" size={size} color={color} />
          ),
        }}
      />

      {/* Pantallas secundarias ocultas del menú inferior */}
      <Tabs.Screen
        name="asientos"
        options={{
          href: null, // Esto oculta la pestaña visualmente
        }}
      />
    </Tabs>
  );
}