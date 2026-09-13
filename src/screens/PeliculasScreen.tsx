import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { theme } from '../components/theme';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';
import PeliculaFila from '../components/PeliculaFila';

import { peliculas } from '../data/peliculas';

export default function PeliculasScreen({ navigation }: any) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  // Blindaje: nos aseguramos de que 'peliculas' exista antes de mapear
  const generosUnicos = useMemo(() => {
    const dataSegura = peliculas || [];
    const generos = dataSegura.map(p => p.genero);
    return ['Todos', ...new Set(generos)];
  }, []);

  const peliculasFiltradas = (peliculas || []).filter((peli) => {
    const coincideTexto = peli.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideGenero = filtroActivo === 'Todos' || peli.genero === filtroActivo;
    return coincideTexto && coincideGenero;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logoText}>LUMINA CINEMAS</Text>
        <View style={styles.avatarPlaceholder} />
      </View>

      <Buscador valor={busqueda} onChangeText={setBusqueda} />

      <View style={styles.filtrosContainer}>
        <Filtros
          opciones={generosUnicos}
          filtroActivo={filtroActivo}
          setFiltroActivo={setFiltroActivo}
        />
      </View>

      <FlatList
        data={peliculasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PeliculaFila
            pelicula={item}
            onPressFuncion={(funcionId) => navigation.navigate('MapaAsientosScreen', { funcionId })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing.edge, alignItems: 'center' },
  logoText: { color: theme.colors.primary, fontFamily: theme.fonts.headline, fontSize: 22, textTransform: 'uppercase' },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primary },
  filtrosContainer: { paddingBottom: theme.spacing.md },
  listContent: { paddingBottom: 100 }
});