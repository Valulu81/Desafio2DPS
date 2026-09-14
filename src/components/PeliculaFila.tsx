import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pelicula } from '../types/pelicula';
import { theme } from './theme';
import { useAppSelector } from '../redux/hooks';

interface Props {
    pelicula: Pelicula;
    onPressFuncion: (funcionId: string) => void;
}

export default function PeliculaFila({ pelicula, onPressFuncion }: Props) {
    const funcionesRedux = useAppSelector(state => state.funciones);
    const funcionesSeguras = pelicula.funciones || [];
    const disponible = pelicula.estado === 'Disponible';

    return (
        <View style={[styles.card, !disponible && styles.cardDeshabilitada]}>
            <Image source={{ uri: pelicula.imagen }} style={[styles.poster, !disponible && styles.posterDeshabilitado]} />

            <View style={styles.info}>
                <View>
                    <View style={styles.tituloRow}>
                        <Text style={styles.title} numberOfLines={1}>{pelicula.nombre}</Text>
                        {!disponible && (
                            <View style={styles.badgeNoDisponible}>
                                <Text style={styles.badgeNoDisponibleText}>NO DISPONIBLE</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.meta}>{pelicula.genero} • {pelicula.duracion} min</Text>
                    <Text style={styles.clasificacion}>{pelicula.clasificacion}</Text>
                </View>

                <View style={styles.showtimeContainer}>
                    {funcionesSeguras.map((funcionId, index) => {
                        const funcionReal = funcionesRedux.find(f => f.id === funcionId);
                        const etiqueta = `Función ${index + 1}`;

                        return (
                            <TouchableOpacity
                                key={funcionId}
                                style={[styles.badge, !disponible && styles.badgeDeshabilitado]}
                                onPress={() => disponible && onPressFuncion(funcionId)}
                                disabled={!disponible}
                                activeOpacity={disponible ? 0.7 : 1}
                            >
                                <Text style={[styles.badgeText, !disponible && styles.badgeTextDeshabilitado]}>
                                    {etiqueta}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, marginHorizontal: theme.spacing.edge, borderRadius: theme.radius.lg, padding: theme.spacing.sm, gap: theme.spacing.sm, marginBottom: theme.spacing.md },
    cardDeshabilitada: { opacity: 0.6 },
    poster: { width: 96, height: 144, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceContainerHigh },
    posterDeshabilitado: { opacity: 0.5 },
    info: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
    tituloRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    title: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18 },
    meta: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12, marginTop: 4 },
    clasificacion: { color: theme.colors.primary, fontFamily: theme.fonts.mono, fontSize: 10, marginTop: 6, textTransform: 'uppercase' },
    showtimeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    badge: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 6, paddingHorizontal: 12, borderRadius: theme.radius.sm },
    badgeDeshabilitado: { backgroundColor: theme.colors.surfaceContainerHigh, opacity: 0.4 },
    badgeText: { color: theme.colors.onSurface, fontFamily: theme.fonts.mono, fontSize: 12 },
    badgeTextDeshabilitado: { color: theme.colors.onSurfaceVariant },
    badgeNoDisponible: { backgroundColor: '#ffb4ab20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeNoDisponibleText: { color: '#ffb4ab', fontFamily: theme.fonts.headline, fontSize: 8 },
});