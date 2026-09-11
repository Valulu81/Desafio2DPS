import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
    FlatList, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../components/theme';
import { Ionicons } from '@expo/vector-icons';

import { funciones } from '../data/funciones';
import { salas } from '../data/salas';
import { peliculas } from '../data/peliculas';
import { Asiento as TipoAsiento } from '../types/asiento';
import Asiento from '../components/Asiento';

export default function MapaAsientosScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { funcionId } = route.params;

    const funcionActual = funciones.find(f => f.id === funcionId);
    const salaActual = salas.find(s => s.id === funcionActual?.salaId);
    const peliculaActual = peliculas.find(p => p.funciones?.includes(funcionId));

    const [asientos, setAsientos] = useState<TipoAsiento[]>([]);
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');

    const letrasFilas = Array.from({ length: salaActual?.filas || 0 }, (_, i) => String.fromCharCode(65 + i));

    useEffect(() => {
        if (!salaActual || !funcionActual) return;

        if (funcionActual.asientos && funcionActual.asientos.length > 0) {
            setAsientos(funcionActual.asientos);
            return;
        }

        const asientosIniciales: TipoAsiento[] = letrasFilas.flatMap((fila) =>
            Array.from({ length: salaActual.columnas }).map((_, j) => ({
                id: `${fila}${j + 1}`,
                fila: fila,
                numero: j + 1,
                estado: 'libre'
            }))
        );

        setAsientos(asientosIniciales);
    }, [funcionActual, salaActual]);

    const toggleSeleccion = (id: string) => {
        setAsientos(prev => prev.map(a => {
            if (a.id !== id || a.estado === 'ocupado') return a;
            return { ...a, estado: a.estado === 'libre' ? 'seleccionado' : 'libre' };
        }));
    };

    const confirmarReserva = () => {
        const seleccionados = asientos.filter(a => a.estado === 'seleccionado');

        if (seleccionados.length === 0) return Alert.alert('Error', 'Debes seleccionar al menos un asiento.');
        if (clienteNombre.trim().length < 3) return Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(clienteEmail)) return Alert.alert('Error', 'Ingresa un email válido.');

        const regexTelefono = /^\d{8,15}$/;
        if (!regexTelefono.test(clienteTelefono.replace(/[\s\-()]/g, ''))) return Alert.alert('Error', 'Teléfono inválido.');

        const asientosActualizados = asientos.map(a =>
            a.estado === 'seleccionado' ? { ...a, estado: 'ocupado' as const } : a
        );

        setAsientos(asientosActualizados);
        Alert.alert('¡Éxito!', 'Reserva confirmada con éxito');
        setClienteNombre('');
        setClienteEmail('');
        setClienteTelefono('');
    };

    if (!salaActual || !funcionActual) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.textoCentrado}>Datos no encontrados</Text>
            </SafeAreaView>
        );
    }

    const seleccionadosCount = asientos.filter(a => a.estado === 'seleccionado').length;
    const precioTotal = seleccionadosCount * (peliculaActual?.precio ?? 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{peliculaActual?.nombre}</Text>
                    <Text style={styles.headerSubtitle}>{salaActual.nombre} - {funcionActual.hora}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>


            {/* Cambiamos el behavior a 'height' para Android y agregamos más padding */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }} // Más espacio para poder hacer scroll por encima del teclado
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.pantallaContainer}>
                        <View style={styles.pantallaArco} />
                        <Text style={styles.pantallaTexto}>PANTALLA</Text>
                    </View>

                    <View style={styles.mapaContainer}>
                        <View style={styles.mapaLayout}>
                            {/* Columna Izquierda: Letras */}
                            <View style={styles.letrasColumn}>
                                {letrasFilas.map(letra => (
                                    <View key={letra} style={styles.letraBox}>
                                        <Text style={styles.letraTexto}>{letra}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Centro: Cuadrícula */}
                            <FlatList
                                data={asientos}
                                keyExtractor={(item) => item.id}
                                numColumns={salaActual.columnas}
                                key={salaActual.columnas}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <Asiento item={item} onPress={() => toggleSeleccion(item.id)} />
                                )}
                            />

                            {/* Columna Derecha: Bloque fantasma para equilibrar el centro */}
                            <View style={styles.espaciadorDerecho} />
                        </View>
                    </View>


                    <View style={styles.leyendaContainer}>
                        <View style={styles.leyendaItem}><View style={[styles.leyendaColor, styles.colorLibre]} /><Text style={styles.leyendaTexto}>Libre</Text></View>
                        <View style={styles.leyendaItem}><View style={[styles.leyendaColor, styles.colorSeleccionado]} /><Text style={styles.leyendaTexto}>Selección</Text></View>
                        <View style={styles.leyendaItem}><View style={[styles.leyendaColor, styles.colorOcupado]} /><Text style={styles.leyendaTexto}>Ocupado</Text></View>
                    </View>

                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenTitle}>Resumen de selección</Text>
                        <Text style={styles.resumenTexto}>Asientos: <Text style={styles.resumenBold}>{seleccionadosCount}</Text></Text>
                        <Text style={styles.resumenTexto}>Total a pagar: <Text style={styles.resumenBold}>${precioTotal.toFixed(2)}</Text></Text>

                        <View style={styles.formContainer}>
                            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={theme.colors.onSurfaceVariant} value={clienteNombre} onChangeText={setClienteNombre} />
                            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={theme.colors.onSurfaceVariant} value={clienteEmail} onChangeText={setClienteEmail} keyboardType="email-address" />
                            <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={theme.colors.onSurfaceVariant} value={clienteTelefono} onChangeText={setClienteTelefono} keyboardType="phone-pad" />
                        </View>

                        <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarReserva}>
                            <Text style={styles.btnConfirmarText}>Confirmar Reserva</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    textoCentrado: { color: theme.colors.onSurface, textAlign: 'center', marginTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.edge, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerHigh },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.pill },
    headerTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 16, textAlign: 'center' },
    headerSubtitle: { color: theme.colors.primary, fontFamily: theme.fonts.mono, fontSize: 12, textAlign: 'center', marginTop: 2 },
    pantallaContainer: { alignItems: 'center', marginVertical: theme.spacing.lg },
    pantallaArco: { width: '80%', height: 4, backgroundColor: theme.colors.primary, borderRadius: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
    pantallaTexto: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.mono, fontSize: 10, letterSpacing: 4, marginTop: 12 },
    mapaContainer: { alignItems: 'center', width: '100%' },
    mapaLayout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    letrasColumn: { width: 30, alignItems: 'center' },
    letraBox: { height: 34, marginVertical: 4, justifyContent: 'center', alignItems: 'center' },
    letraTexto: { color: theme.colors.primary, fontFamily: theme.fonts.headline, fontSize: 16 },
    leyendaContainer: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginVertical: 24 },
    leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    leyendaColor: { width: 16, height: 16, borderRadius: 4 },
    colorLibre: { backgroundColor: theme.colors.surfaceContainerHigh, borderWidth: 1, borderColor: theme.colors.onSurfaceVariant + '40' },
    colorSeleccionado: { backgroundColor: theme.colors.primary },
    colorOcupado: { backgroundColor: '#1a1d24', opacity: 0.5 },
    leyendaTexto: { color: theme.colors.onSurfaceVariant, fontSize: 12 },
    resumenCard: { backgroundColor: theme.colors.surfaceContainerLow, margin: theme.spacing.edge, padding: theme.spacing.md, borderRadius: theme.radius.lg },
    resumenTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18, marginBottom: 12 },
    resumenTexto: { color: theme.colors.onSurfaceVariant, marginBottom: 4 },
    resumenBold: { color: theme.colors.onSurface, fontWeight: 'bold' },
    formContainer: { marginTop: 16, gap: 12 },
    input: { backgroundColor: theme.colors.surfaceContainerHigh, color: theme.colors.onSurface, padding: 12, borderRadius: theme.radius.sm },
    btnConfirmar: { backgroundColor: theme.colors.primary, marginTop: 24, padding: 16, borderRadius: theme.radius.pill, alignItems: 'center' },
    btnConfirmarText: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 16 },
    espaciadorDerecho: { width: 30 },
});