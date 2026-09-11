import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from './theme';
import { Asiento as TipoAsiento } from '../types/asiento';

interface Props {
    item: TipoAsiento;
    onPress: () => void;
}

export default function Asiento({ item, onPress }: Props) {
    return (
        <TouchableOpacity 
            style={[
                styles.base, 
                item.estado === 'libre' && styles.libre,
                item.estado === 'seleccionado' && styles.seleccionado,
                item.estado === 'ocupado' && styles.ocupado
            ]}
            onPress={onPress}
            disabled={item.estado === 'ocupado'}
        >
            <Text style={[styles.texto, item.estado === 'seleccionado' && styles.textoSeleccionado]}>
                {item.numero}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: { width: 34, height: 34, marginVertical: 4, marginHorizontal: 4, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    libre: { backgroundColor: theme.colors.surfaceContainerHigh, borderWidth: 1, borderColor: theme.colors.onSurfaceVariant + '40' },
    seleccionado: { backgroundColor: theme.colors.primary },
    ocupado: { backgroundColor: '#1a1d24', opacity: 0.5 },
    texto: { fontFamily: theme.fonts.mono, fontSize: 10, color: theme.colors.onSurfaceVariant },
    textoSeleccionado: { color: theme.colors.onPrimary, fontWeight: 'bold' }
});