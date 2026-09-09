import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { theme } from '@/components/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  DetallePelicula: undefined;
};

type CarteleraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: CarteleraScreenNavigationProp;
}

export default function CarteleraScreen({ navigation }: Props) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>LUMINA CINEMAS</Text>
        <View style={styles.avatarPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trust Pill */}
        <View style={styles.trustPill}>
          <Ionicons name="flash" size={16} color={theme.colors.secondary} />
          <Text style={styles.trustText}>Compra rápida sin registro previo</Text>
        </View>

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity style={[styles.filterChip, styles.filterActive]}>
            <Text style={styles.filterTextActive}>En Cartelera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Próximos Estrenos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>IMAX 3D</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Película Destacada */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selección Hoy</Text>
        </View>

        <TouchableOpacity
          style={styles.movieCard}
          onPress={() => router.push('/asientos')}
        >
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnHbJKt3VJlTr1sCOBhU6x1U7-wDq3QjFA7ynIlGJNfxdctUSWI6JYUtGjIKSRAuuUCuhoLCyvdPWwsDU0iAMTGa4FfZZFDjkrpvGxPm1ngXxB522VRT5_WpSDGeCtEr-YF-yEUCF0NBZgPq6jJpmsR9rb-eAsXcP0XWJ5S0JvYbZvObXuGi41r2tRRAXwFAgsMEuq7LNEyDmK7NC4fU-Ss9WUJKImtztYamVgDcwfDzeI9yoHAyBsVw' }}
            style={styles.poster}
          />
          <View style={styles.movieInfo}>
            <View>
              <Text style={styles.movieTitle}>Duna: Parte Dos</Text>
              <Text style={styles.movieMeta}>Ciencia Ficción • 166 min</Text>
            </View>
            <View style={styles.showtimeContainer}>
              <View style={styles.showtimeBadge}>
                <Text style={styles.showtimeText}>16:00</Text>
              </View>
              <View style={[styles.showtimeBadge, styles.showtimeActive]}>
                <Text style={styles.showtimeTextActive}>19:30</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing.edge, alignItems: 'center' },
  logoText: { color: theme.colors.primary, fontFamily: theme.fonts.headline, fontSize: 22, textTransform: 'uppercase' },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primary },
  trustPill: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, marginHorizontal: theme.spacing.edge, padding: theme.spacing.xs, borderRadius: theme.radius.pill, alignItems: 'center', gap: 8 },
  trustText: { color: theme.colors.secondary, fontFamily: theme.fonts.body, fontSize: 12 },
  filterScroll: { paddingHorizontal: theme.spacing.edge, marginTop: theme.spacing.md, maxHeight: 40 },
  filterChip: { backgroundColor: theme.colors.surfaceContainerHigh, paddingHorizontal: 16, paddingVertical: 8, borderRadius: theme.radius.pill, marginRight: 8, justifyContent: 'center' },
  filterActive: { backgroundColor: theme.colors.primary },
  filterText: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 14 },
  filterTextActive: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 14 },
  sectionHeader: { padding: theme.spacing.edge, marginTop: theme.spacing.sm },
  sectionTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 22 },
  movieCard: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, marginHorizontal: theme.spacing.edge, borderRadius: theme.radius.lg, padding: theme.spacing.sm, gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  poster: { width: 96, height: 144, borderRadius: theme.radius.md },
  movieInfo: { flex: 1, justifyContent: 'space-between' },
  movieTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18 },
  movieMeta: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12, marginTop: 4 },
  showtimeContainer: { flexDirection: 'row', gap: 8 },
  showtimeBadge: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 8, paddingHorizontal: 12, borderRadius: theme.radius.md },
  showtimeActive: { backgroundColor: theme.colors.primary },
  showtimeText: { color: theme.colors.onSurface, fontFamily: theme.fonts.mono, fontSize: 14 },
  showtimeTextActive: { color: theme.colors.onPrimary, fontFamily: theme.fonts.mono, fontSize: 14, fontWeight: 'bold' }
});