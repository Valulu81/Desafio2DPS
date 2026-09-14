import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, Switch } from 'react-native';
import { theme } from '../components/theme';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';
import PeliculaFila from '../components/PeliculaFila';
import { useAppSelector } from '../redux/hooks';
import { salas } from '../data/salas';

export default function PeliculasScreen({ navigation }: any) {
    const [busqueda, setBusqueda] = useState('');
    const [filtroGenero, setFiltroGenero] = useState('Todos');
    const [filtroClasificacion, setFiltroClasificacion] = useState('Todos');
    const [filtroSala, setFiltroSala] = useState('Todos');
    const [mostrarNoDisponibles, setMostrarNoDisponibles] = useState(false);

    const peliculasRedux = useAppSelector(state => state.peliculas);
    const funcionesRedux = useAppSelector(state => state.funciones);

    const generosUnicos = useMemo(() => {
        const dataSegura = peliculasRedux || [];
        const generos = dataSegura.map(p => {
            const generoLimpio = p.genero.trim();
            return generoLimpio.charAt(0).toUpperCase() + generoLimpio.slice(1).toLowerCase();
        });

        return ['Todos', ...new Set(generos)];
    }, [peliculasRedux]);

    const clasificacionesUnicas = useMemo(() => {
        const dataSegura = peliculasRedux || [];
        const clasifs = dataSegura.map(p => p.clasificacion.trim());
        return ['Todos', ...new Set(clasifs)];
    }, [peliculasRedux]);

    const salasNombres = useMemo(() => {
        return ['Todos', ...salas.map(s => s.nombre)];
    }, []);

    const peliculasFiltradas = useMemo(() => {
        const dataSegura = peliculasRedux || [];
        return dataSegura.filter((peli) => {
            const coincideTexto = peli.nombre.toLowerCase().includes(busqueda.toLowerCase());

            const generoPeliLimpio = peli.genero.trim().toLowerCase();
            const filtroGeneroLimpio = filtroGenero.trim().toLowerCase();
            const coincideGenero = filtroGenero === 'Todos' || generoPeliLimpio === filtroGeneroLimpio;

            const coincideClasificacion = filtroClasificacion === 'Todos' || peli.clasificacion.trim() === filtroClasificacion;

            const nombresSalasDeLaPeli = peli.funciones
                ?.map(fid => funcionesRedux.find(f => f.id === fid))
                .filter(Boolean)
                .map(f => salas.find(s => s.id === f?.salaId)?.nombre);

            const coincideSala = filtroSala === 'Todos' || nombresSalasDeLaPeli?.includes(filtroSala);

            const coincideEstado = mostrarNoDisponibles ? true : peli.estado === 'Disponible';

            return coincideTexto && coincideGenero && coincideClasificacion && coincideSala && coincideEstado;
        });
    }, [peliculasRedux, funcionesRedux, busqueda, filtroGenero, filtroClasificacion, filtroSala, mostrarNoDisponibles]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.logoText}>LUMINA CINEMAS</Text>
                <View style={styles.avatarPlaceholder} />
            </View>

            <Buscador valor={busqueda} onChangeText={setBusqueda} />

            <View style={styles.filtrosContainer}>
                <Text style={styles.filtroLabel}>Género</Text>
                <Filtros
                    opciones={generosUnicos}
                    filtroActivo={filtroGenero}
                    setFiltroActivo={setFiltroGenero}
                />

                <Text style={styles.filtroLabel}>Clasificación</Text>
                <Filtros
                    opciones={clasificacionesUnicas}
                    filtroActivo={filtroClasificacion}
                    setFiltroActivo={setFiltroClasificacion}
                />

                <Text style={styles.filtroLabel}>Sala</Text>
                <Filtros
                    opciones={salasNombres}
                    filtroActivo={filtroSala}
                    setFiltroActivo={setFiltroSala}
                />

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Mostrar no disponibles</Text>
                    <Switch
                        value={mostrarNoDisponibles}
                        onValueChange={setMostrarNoDisponibles}
                        trackColor={{ false: theme.colors.surfaceContainerHigh, true: theme.colors.primary }}
                        thumbColor={theme.colors.onPrimary}
                    />
                </View>
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
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No se encontraron películas con esos filtros.</Text>
                }
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
    filtroLabel: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
        textTransform: 'uppercase',
        marginLeft: theme.spacing.edge,
        marginTop: 8,
        marginBottom: 2,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: theme.spacing.edge,
        marginTop: 8,
        marginBottom: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: theme.radius.md,
    },
    switchLabel: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        fontSize: 13,
    },
    listContent: { paddingBottom: 100 },
    emptyText: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 40,
    },
});