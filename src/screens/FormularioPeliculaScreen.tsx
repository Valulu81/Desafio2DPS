import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, TextInput, Switch, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../components/theme';
import { Pelicula } from '../types/pelicula';
import { Funcion } from '../types/funcion';
import { salas } from '../data/salas';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addPelicula, editPelicula, deletePelicula } from '../redux/slices/peliculasSlice';
import { setFunciones } from '../redux/slices/funcionesSlice';

export default function FormularioPeliculaScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const listaPeliculas = useAppSelector(state => state.peliculas);
    const funcionesRedux = useAppSelector(state => state.funciones) || [];

    const [modalVisible, setModalVisible] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [form, setForm] = useState({
        nombre: '', genero: '', duracion: '', clasificacion: '', precio: '', imagen: '', estado: true
    });

    const [formFunciones, setFormFunciones] = useState<Funcion[]>([]);

    const abrirFormulario = (pelicula?: Pelicula) => {
        if (pelicula) {
            setEditandoId(pelicula.id);
            setForm({
                nombre: pelicula.nombre,
                genero: pelicula.genero,
                duracion: pelicula.duracion.toString(),
                clasificacion: pelicula.clasificacion,
                precio: pelicula.precio.toString(),
                imagen: pelicula.imagen,
                estado: pelicula.estado === 'Disponible'
            });
            const funcionesPeli = funcionesRedux.filter(f => pelicula.funciones?.includes(f.id));
            setFormFunciones(funcionesPeli);
        } else {
            setEditandoId(null);
            setForm({ nombre: '', genero: '', duracion: '', clasificacion: '', precio: '', imagen: '', estado: true });
            setFormFunciones([]);
        }
        setModalVisible(true);
    };

    const agregarFuncion = () => {
        setFormFunciones([...formFunciones, {
            id: `f${Date.now()}`,
            hora: '',
            salaId: salas[0]?.id || 's1', // Asigna la primera sala  por defecto
            asientos: []
        }]);
    };

    const actualizarFuncion = (index: number, campo: keyof Funcion, valor: string) => {
        const nuevas = [...formFunciones];
        nuevas[index] = { ...nuevas[index], [campo]: valor };
        setFormFunciones(nuevas);
    };

    const eliminarFuncion = (index: number) => {
        setFormFunciones(formFunciones.filter((_, i) => i !== index));
    };

    const guardarPelicula = () => {
        if (!form.nombre || !form.precio) return Alert.alert('Error', 'Nombre y precio son obligatorios');

        const idsFuncionesActuales = formFunciones.map(f => f.id);

        let nuevoArregloFunciones = [...funcionesRedux];
        formFunciones.forEach(fForm => {
            const existeIndex = nuevoArregloFunciones.findIndex(f => f.id === fForm.id);
            if (existeIndex >= 0) {
                nuevoArregloFunciones[existeIndex] = { ...nuevoArregloFunciones[existeIndex], hora: fForm.hora, salaId: fForm.salaId };
            } else {
                nuevoArregloFunciones.push(fForm);
            }
        });
        dispatch(setFunciones(nuevoArregloFunciones));

        if (editandoId) {
            dispatch(editPelicula({
                id: editandoId,
                codigo: listaPeliculas.find(p => p.id === editandoId)?.codigo || '',
                nombre: form.nombre,
                genero: form.genero,
                duracion: parseInt(form.duracion) || 0,
                clasificacion: form.clasificacion,
                precio: parseFloat(form.precio) || 0,
                imagen: form.imagen || 'https://via.placeholder.com/150',
                estado: form.estado ? 'Disponible' : 'No disponible',
                funciones: idsFuncionesActuales
            }));
        } else {
            dispatch(addPelicula({
                codigo: `MOV-${Math.floor(Math.random() * 1000)}`,
                nombre: form.nombre,
                genero: form.genero || 'Sin definir',
                duracion: parseInt(form.duracion) || 120,
                clasificacion: form.clasificacion || 'A',
                precio: parseFloat(form.precio) || 0,
                imagen: form.imagen || 'https://via.placeholder.com/150',
                estado: form.estado ? 'Disponible' : 'No disponible',
                funciones: idsFuncionesActuales
            }));
        }
        setModalVisible(false);
    };

    const eliminar = (id: number) => {
        Alert.alert('Eliminar', '¿Estás seguro de eliminar esta película?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(deletePelicula(id)) }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnIcon}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={styles.title}>Gestión de Catálogo</Text>
                <View style={styles.btnIcon} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.btnAgregar} onPress={() => abrirFormulario()}>
                    <Ionicons name="add" size={20} color={theme.colors.onPrimary} />
                    <Text style={styles.btnAgregarTexto}>Agregar Película</Text>
                </TouchableOpacity>

                {listaPeliculas.map((peli) => (
                    <View key={peli.id} style={styles.card}>
                        <View style={styles.cardTop}>
                            <Image source={{ uri: peli.imagen }} style={styles.poster} />
                            <View style={styles.cardInfo}>
                                <View style={styles.badges}>
                                    <Text style={styles.badgeCode}>{peli.codigo}</Text>
                                    <View style={[styles.badgeEstado, { backgroundColor: peli.estado === 'Disponible' ? theme.colors.primary + '20' : theme.colors.outline + '20' }]}>
                                        <View style={[styles.dot, { backgroundColor: peli.estado === 'Disponible' ? theme.colors.primary : theme.colors.outline }]} />
                                        <Text style={[styles.badgeEstadoText, { color: peli.estado === 'Disponible' ? theme.colors.primary : theme.colors.outline }]}>
                                            {peli.estado.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.movieTitle} numberOfLines={1}>{peli.nombre}</Text>
                                <Text style={styles.movieMeta}>{peli.clasificacion} • {peli.duracion} min • {peli.genero}</Text>
                                <Text style={styles.moviePrice}>Entrada: ${peli.precio.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity style={styles.btnAccion} onPress={() => abrirFormulario(peli)}>
                                <MaterialIcons name="edit" size={16} color={theme.colors.tertiary} />
                                <Text style={styles.btnAccionTexto}>Editar Ficha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnAccion, { borderLeftWidth: 1, borderLeftColor: theme.colors.surfaceContainerHigh }]} onPress={() => eliminar(peli.id)}>
                                <MaterialIcons name="delete-outline" size={18} color="#ffb4ab" />
                                <Text style={[styles.btnAccionTexto, { color: '#ffb4ab' }]}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setModalVisible(false)}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{editandoId ? 'Editar Película' : 'Nueva Película'}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} value={form.nombre} onChangeText={t => setForm({ ...form, nombre: t })} />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Género</Text>
                                <TextInput style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} value={form.genero} onChangeText={t => setForm({ ...form, genero: t })} />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Duración (min)</Text>
                                <TextInput style={styles.input} keyboardType="numeric" placeholderTextColor={theme.colors.onSurfaceVariant} value={form.duracion} onChangeText={t => setForm({ ...form, duracion: t })} />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Clasificación</Text>
                                <TextInput style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} value={form.clasificacion} onChangeText={t => setForm({ ...form, clasificacion: t })} />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Precio ($)</Text>
                                <TextInput style={styles.input} keyboardType="numeric" placeholderTextColor={theme.colors.onSurfaceVariant} value={form.precio} onChangeText={t => setForm({ ...form, precio: t })} />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>URL Imagen (Poster)</Text>
                            <TextInput style={styles.input} placeholderTextColor={theme.colors.onSurfaceVariant} value={form.imagen} onChangeText={t => setForm({ ...form, imagen: t })} />
                        </View>

                        <View style={[styles.inputGroup, styles.rowSwitch]}>
                            <Text style={styles.label}>Disponible en Cartelera</Text>
                            <Switch
                                value={form.estado}
                                onValueChange={v => setForm({ ...form, estado: v })}
                                trackColor={{ false: theme.colors.surfaceContainerHigh, true: theme.colors.primary }}
                                thumbColor={theme.colors.onPrimary}
                            />
                        </View>

                        <View style={styles.funcionesSection}>
                            <View style={styles.funcionesHeader}>
                                <Text style={styles.label}>Horarios y Salas</Text>
                                <TouchableOpacity onPress={agregarFuncion}>
                                    <Text style={styles.btnTextLight}>+ Añadir Horario</Text>
                                </TouchableOpacity>
                            </View>

                            {formFunciones.map((func, index) => (
                                <View key={func.id} style={styles.funcionRow}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, height: 50 }]}
                                        placeholder="Hora (Ej. 15:30)"
                                        placeholderTextColor={theme.colors.onSurfaceVariant}
                                        value={func.hora}
                                        onChangeText={t => actualizarFuncion(index, 'hora', t)}
                                    />
                                    
                                    <View style={[styles.input, { flex: 1.5, padding: 0, height: 50, justifyContent: 'center' }]}>
                                        <Picker
                                            selectedValue={func.salaId}
                                            onValueChange={(itemValue) => actualizarFuncion(index, 'salaId', itemValue)}
                                            style={{ color: theme.colors.onSurface }}
                                            dropdownIconColor={theme.colors.primary}
                                        >
                                            {salas.map(sala => (
                                                <Picker.Item key={sala.id} label={sala.nombre} value={sala.id} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <TouchableOpacity style={styles.btnDelete} onPress={() => eliminarFuncion(index)}>
                                        <Ionicons name="trash-outline" size={20} color="#ffb4ab" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {formFunciones.length === 0 && (
                                <Text style={styles.emptyText}>No hay horarios asignados.</Text>
                            )}
                        </View>

                        <TouchableOpacity style={styles.btnGuardar} onPress={guardarPelicula}>
                            <Text style={styles.btnGuardarTexto}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.edge, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerHigh },
    btnIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.pill },
    title: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18 },
    scrollContent: { padding: theme.spacing.edge, paddingBottom: 100 },
    btnAgregar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.colors.primary, padding: 16, borderRadius: theme.radius.lg, marginBottom: theme.spacing.lg },
    btnAgregarTexto: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 14, textTransform: 'uppercase' },
    card: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: theme.radius.xl, marginBottom: theme.spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.surfaceContainerHigh },
    cardTop: { flexDirection: 'row', padding: theme.spacing.sm, gap: theme.spacing.md },
    poster: { width: 80, height: 120, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceContainerHigh },
    cardInfo: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
    badges: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badgeCode: { color: theme.colors.tertiary, fontSize: 10, fontFamily: theme.fonts.mono, backgroundColor: theme.colors.surfaceContainerHigh, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeEstado: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    badgeEstadoText: { fontSize: 9, fontFamily: theme.fonts.headline },
    movieTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 16, marginTop: 8 },
    movieMeta: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 11, marginTop: 4 },
    moviePrice: { color: theme.colors.onSurface, fontFamily: theme.fonts.mono, fontSize: 13, marginTop: 8 },
    cardActions: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainer, borderTopWidth: 1, borderTopColor: theme.colors.surfaceContainerHigh },
    btnAccion: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
    btnAccionTexto: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 12 },
    modalContainer: { flex: 1, backgroundColor: theme.colors.surface },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.edge, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerHigh },
    modalTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 18 },
    formContent: { padding: theme.spacing.edge, gap: 16, paddingBottom: 40 },
    row: { flexDirection: 'row', gap: 12 },
    inputGroup: { gap: 6 },
    label: { color: theme.colors.onSurfaceVariant, fontSize: 11, fontFamily: theme.fonts.headline, textTransform: 'uppercase' },
    input: { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, paddingHorizontal: 12, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.surfaceContainerHigh },
    rowSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerLow, padding: 12, borderRadius: theme.radius.sm },
    funcionesSection: { marginTop: 8, padding: 12, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.surfaceContainerHigh },
    funcionesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    btnTextLight: { color: theme.colors.primary, fontSize: 12, fontFamily: theme.fonts.headline },
    funcionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    btnDelete: { height: 50, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.sm },
    emptyText: { color: theme.colors.onSurfaceVariant, fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginVertical: 8 },
    btnGuardar: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: theme.radius.pill, alignItems: 'center', marginTop: 12 },
    btnGuardarTexto: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 16 }
});