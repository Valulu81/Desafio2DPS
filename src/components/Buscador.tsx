import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

interface Props {
    valor: string;
    onChangeText: (text: string) => void;
}

export default function Buscador({ valor, onChangeText }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
            <TextInput
                style={styles.input}
                placeholder="Buscar película..."
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={valor}
                onChangeText={onChangeText}
                selectionColor={theme.colors.primary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerHigh,
        marginHorizontal: theme.spacing.edge,
        paddingHorizontal: 16,
        borderRadius: theme.radius.pill,
        height: 48,
        marginTop: theme.spacing.md,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.body,
        fontSize: 14,
    }
});