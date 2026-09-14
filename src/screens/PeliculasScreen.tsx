import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { theme } from '../components/theme';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';
import PeliculaFila from '../components/PeliculaFila';
import { useAppSelector } from '../redux/hooks'; 

export default function PeliculasScreen({ navigation }: any) {
    const [busqueda, setBusqueda] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('Todos');

    const peliculasRedux = useAppSelector(state => state.peliculas);

    const generosUnicos = useMemo(() => {
        const dataSegura = peliculasRedux || [];
        const generos = dataSegura.map(p => {
            const generoLimpio = p.genero.trim();
            return generoLimpio.charAt(0).toUpperCase() + generoLimpio.slice(1).toLowerCase();
        });
        
        return ['Todos', ...new Set(generos)];
    }, [peliculasRedux]);

    const peliculasFiltradas = useMemo(() => {
        const dataSegura = peliculasRedux || [];
        return dataSegura.filter((peli) => {
            const coincideTexto = peli.nombre.toLowerCase().includes(busqueda.toLowerCase());
            
            const generoPeliLimpio = peli.genero.trim().toLowerCase();
            const filtroLimpio = filtroActivo.trim().toLowerCase();
            const coincideGenero = filtroActivo === 'Todos' || generoPeliLimpio === filtroLimpio;
            
            return coincideTexto && coincideGenero;
        });
    }, [peliculasRedux, busqueda, filtroActivo]);

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