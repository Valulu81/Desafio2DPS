import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pelicula } from '../types/pelicula';
import { theme } from './theme'; // Aquí está bien porque están en la misma carpeta

interface Props {
    pelicula: Pelicula;
    onPressFuncion: (funcionId: string) => void;
}

export default function PeliculaFila({ pelicula, onPressFuncion }: Props) {
    // Blindaje: Si 'funciones' no viene definido, usamos un arreglo vacío
    const funcionesSeguras = pelicula.funciones || [];

    return (
        <View style={styles.card}>
            <Image source={{ uri: pelicula.imagen }} style={styles.poster} />

            <View style={styles.info}>
                <View>
                    <Text style={styles.title} numberOfLines={1}>{pelicula.nombre}</Text>
                    <Text style={styles.meta}>{pelicula.genero} • {pelicula.duracion} min</Text>
                    <Text style={styles.clasificacion}>{pelicula.clasificacion}</Text>
                </View>

                <View style={styles.showtimeContainer}>
                    {funcionesSeguras.map((funcionId, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.badge}
                            onPress={() => onPressFuncion(funcionId)}
                        >
                            <Text style={styles.badgeText}>{funcionId}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, marginHorizontal: theme.spacing.edge, borderRadius: theme.radius.lg, padding: theme.spacing.sm, gap: theme.spacing.sm, marginBottom: theme.spacing.md },
    poster: { width: 96, height: 144, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceContainerHigh },
    info: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
    title: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18 },
    meta: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12, marginTop: 4 },
    clasificacion: { color: theme.colors.primary, fontFamily: theme.fonts.mono, fontSize: 10, marginTop: 6, textTransform: 'uppercase' },
    showtimeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    badge: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 6, paddingHorizontal: 12, borderRadius: theme.radius.sm },
    badgeText: { color: theme.colors.onSurface, fontFamily: theme.fonts.mono, fontSize: 12 }
});