import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from './theme';

interface Props {
    opciones: string[];
    filtroActivo: string;
    setFiltroActivo: (filtro: string) => void;
}

export default function Filtros({ opciones, filtroActivo, setFiltroActivo }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.content}
        >
            {opciones.map((filtro) => (
                <TouchableOpacity
                    key={filtro}
                    style={[styles.chip, filtroActivo === filtro && styles.chipActivo]}
                    onPress={() => setFiltroActivo(filtro)}
                >
                    <Text style={filtroActivo === filtro ? styles.textActivo : styles.text}>
                        {filtro}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { marginTop: theme.spacing.md, maxHeight: 40 },
    content: { paddingHorizontal: theme.spacing.edge },
    chip: { backgroundColor: theme.colors.surfaceContainerHigh, paddingHorizontal: 16, paddingVertical: 8, borderRadius: theme.radius.pill, marginRight: 8, justifyContent: 'center' },
    chipActivo: { backgroundColor: theme.colors.primary },
    text: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 14 },
    textActivo: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 14 },
});