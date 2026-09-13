import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from "@react-navigation/native";
import { theme } from '../components/theme';
import { useAppSelector } from '../redux/hooks';
import { salas } from '../data/salas';
import { BarChart } from 'react-native-gifted-charts';

export default function StaffScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'scanner' | 'dashboard'>('scanner');
    const [permission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const [manualCode, setManualCode] = useState('');

    // Dashboard
    const peliculasRedux = useAppSelector(state => state.peliculas);
    const funcionesRedux = useAppSelector(state => state.funciones);
    const reservasRedux = useAppSelector(state => state.reservas.lista);
    const [chartContainerWidth, setChartContainerWidth] = useState(0);

    const totalPeliculas = peliculasRedux.length;
    const totalFunciones = funcionesRedux.length;
    const totalBoletosVendidos = reservasRedux.reduce((sum, r) => sum + r.boletos, 0);
    const ingresosGenerados = reservasRedux.reduce((sum, r) => sum + r.monto, 0);

    let totalAsientosDisponibles = 0;
    let totalAsientosOcupados = 0;

    funcionesRedux.forEach(f => {
        const sala = salas.find(s => s.id === f.salaId);
        if (!sala) return;
        const capacidad = sala.filas * sala.columnas;

        if (f.asientos && f.asientos.length > 0) {
            const ocupados = f.asientos.filter(a => a.estado === 'ocupado').length;
            totalAsientosOcupados += ocupados;
            totalAsientosDisponibles += (capacidad - ocupados);
        } else {
            totalAsientosDisponibles += capacidad;
        }
    });

    // Película más reservada (por cantidad de boletos vendidos)
    const ingresosPorPelicula: Record<string, number> = {};
    reservasRedux.forEach(r => {
        ingresosPorPelicula[r.pelicula] = (ingresosPorPelicula[r.pelicula] || 0) + r.monto;
    });

    const peliculaMasReservada = Object.entries(
        reservasRedux.reduce((acc: Record<string, number>, r) => {
            acc[r.pelicula] = (acc[r.pelicula] || 0) + r.boletos;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1])[0];

    // Data del gráfico de barras (ingresos por película)
    const dataGrafico = Object.entries(ingresosPorPelicula).map(([nombre, monto]) => ({
        value: monto,
        label: nombre.length > 8 ? nombre.substring(0, 8) + '…' : nombre,
        frontColor: theme.colors.primary,
    }));

    useFocusEffect(
        useCallback(() => {
            setIsAuthenticated(false);
            authenticateStaff();
            return () => {
                setIsAuthenticated(false);
            };
        }, [])
    );

    // aqui ta la magia, aqui es donde se autentica
    const authenticateStaff = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert('Error', 'El dispositivo no soporta o no tiene configurada la biometría.');
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Acceso Restringido - Zona Staff',
                fallbackLabel: 'Usar PIN del dispositivo',
                cancelLabel: 'Cancelar',
            });

            if (result.success) {
                setIsAuthenticated(true);
                if (!permission?.granted) {
                    requestPermission();
                }
            } else {
                Alert.alert('Acceso Denegado', 'No se pudo verificar la identidad.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const lockTerminal = () => {
        setIsAuthenticated(false);
    };

    // aqui es una mini ventanita que se muestra si aun no se autentica
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.lockedContainer}>
                <StatusBar barStyle="light-content" />
                <View style={styles.lockedBox}>
                    <View style={styles.lockedIconWrapper}>
                        <Ionicons name="lock-closed" size={48} color={theme.colors.tertiary} />
                    </View>
                    <Text style={styles.lockedTitle}>Lumina Concierge HUD</Text>
                    <Text style={styles.lockedSubtitle}>Zona protegida para personal autorizado.</Text>
                    <TouchableOpacity style={styles.authButton} onPress={authenticateStaff}>
                        <Ionicons name="finger-print" size={24} color={theme.colors.onPrimary} />
                        <Text style={styles.authButtonText}>Desbloquear Terminal</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // aqui ta ya la vista
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header Staff */}
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.shieldIcon}>
                        <Ionicons name="shield-checkmark" size={18} color={theme.colors.tertiary} />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Zona de Personal</Text>
                        <Text style={styles.headerSubtitle}>Lumina Concierge HUD • Turno Vespertino</Text>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Tarjeta de Autenticación Exitosa */}
                <View style={styles.authSuccessCard}>
                    <View style={styles.authSuccessLeft}>
                        <View style={styles.fingerprintBox}>
                            <Ionicons name="finger-print" size={24} color={theme.colors.tertiary} />
                        </View>
                        <View>
                            <Text style={styles.authSuccessText}>Autenticación Biométrica Exitosa</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.lockBtn} onPress={lockTerminal}>
                        <Ionicons name="lock-open" size={20} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                </View>

                {/* Pestañas (Tabs) */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'scanner' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('scanner')}
                    >
                        <Ionicons name="qr-code-outline" size={16} color={activeTab === 'scanner' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} />
                        <Text style={[styles.tabText, activeTab === 'scanner' && styles.tabTextActive]}>Validador QR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'dashboard' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('dashboard')}
                    >
                        <Ionicons name="bar-chart-outline" size={16} color={activeTab === 'dashboard' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} />
                        <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>Dashboard</Text>
                    </TouchableOpacity>
                </View>

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <View style={styles.dashboardSection}>
                        <View style={styles.mainMetricCard}>
                            <View style={styles.mainMetricIcon}>
                                <Ionicons name="cash-outline" size={24} color={theme.colors.onPrimary} />
                            </View>
                            <View>
                                <Text style={styles.metricLabel}>Ingresos Generados</Text>
                                <View style={styles.metricRow}>
                                    <Text style={styles.metricValueLarge}>${ingresosGenerados.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.grid2Col}>
                            <View style={styles.gridCard}>
                                <View style={styles.gridCardHeader}>
                                    <Text style={styles.gridCardLabel}>Películas</Text>
                                    <Ionicons name="film" size={18} color={theme.colors.tertiary} />
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.gridCardValue}>{totalPeliculas}</Text>
                                    <Text style={styles.gridCardSub}>en cartelera</Text>
                                </View>
                            </View>

                            <View style={styles.gridCard}>
                                <View style={styles.gridCardHeader}>
                                    <Text style={styles.gridCardLabel}>Funciones</Text>
                                    <Ionicons name="time" size={18} color={theme.colors.secondary} />
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.gridCardValue}>{totalFunciones}</Text>
                                    <Text style={styles.gridCardSub}>totales</Text>
                                </View>
                            </View>

                            <View style={styles.gridCard}>
                                <View style={styles.gridCardHeader}>
                                    <Text style={styles.gridCardLabel}>Boletos</Text>
                                    <Ionicons name="ticket" size={18} color={theme.colors.primary} />
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.gridCardValue}>{totalBoletosVendidos}</Text>
                                    <Text style={styles.gridCardSub}>vendidos</Text>
                                </View>
                            </View>

                            <View style={styles.gridCard}>
                                <View style={styles.gridCardHeader}>
                                    <Text style={styles.gridCardLabel}>Asientos</Text>
                                    <Ionicons name="body" size={18} color={theme.colors.tertiary} />
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.gridCardValue}>{totalAsientosDisponibles}</Text>
                                    <Text style={styles.gridCardSub}>disponibles</Text>
                                </View>
                            </View>

                            <View style={styles.gridCard}>
                                <View style={styles.gridCardHeader}>
                                    <Text style={styles.gridCardLabel}>Ocupados</Text>
                                    <Ionicons name="warning" size={18} color={theme.colors.secondary} />
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.gridCardValue}>{totalAsientosOcupados}</Text>
                                    <Text style={styles.gridCardSub}>ocupados</Text>
                                </View>
                            </View>

                            {peliculaMasReservada && (
                                <View style={styles.gridCard}>
                                    <View style={styles.gridCardHeader}>
                                        <Text style={styles.gridCardLabel}>Más reservada</Text>
                                        <Ionicons name="trophy" size={18} color={theme.colors.tertiary} />
                                    </View>
                                    <View>
                                        <Text style={styles.gridCardValue} numberOfLines={1}>{peliculaMasReservada[0]}</Text>
                                        <Text style={styles.gridCardSub}>{peliculaMasReservada[1]} boletos</Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Gráfico de Ingresos por Película */}
                        <View
                            style={styles.chartCard}
                            onLayout={(event) => setChartContainerWidth(event.nativeEvent.layout.width)}
                        >
                            <View style={styles.gridCardHeader}>
                                <Text style={styles.gridCardLabel}>Ingresos por película</Text>
                                <Ionicons name="bar-chart" size={18} color={theme.colors.primary} />
                            </View>

                            {dataGrafico.length > 0 && chartContainerWidth > 0 ? (
                                <BarChart
                                    data={dataGrafico}
                                    width={chartContainerWidth}
                                    barWidth={28}
                                    spacing={
                                        dataGrafico.length > 1
                                            ? (chartContainerWidth - (28 * dataGrafico.length)) / dataGrafico.length
                                            : chartContainerWidth - 28
                                    }
                                    roundedTop
                                    hideRules
                                    xAxisThickness={0}
                                    yAxisThickness={0}
                                    yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                                    xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                                    noOfSections={4}
                                    height={180}
                                    disableScroll
                                />
                            ) : (
                                <Text style={styles.gridCardSub}>Aún no hay ventas registradas</Text>
                            )}
                        </View>
                    </View>
                )}

                {/* CONTENIDO: Escáner QR */}
                {activeTab === 'scanner' && (
                    <View style={styles.scannerSection}>
                        <View style={styles.cameraWrapper}>
                            {permission?.granted ? (
                                <CameraView
                                    style={styles.camera}
                                    facing="back"
                                    enableTorch={torch}
                                    onBarcodeScanned={({ data }) => Alert.alert('Boleto Escaneado', `Código: ${data}`)}
                                />
                            ) : (
                                <View style={styles.noCameraView}>
                                    <Text style={styles.noCameraText}>Sin acceso a la cámara</Text>
                                </View>
                            )}

                            {/* HUD Overlay (Retícula Cyan) */}
                            <View style={styles.hudOverlay}>
                                <View style={styles.hudHeader}>
                                    <View style={styles.hudBadge}>
                                        <View style={styles.hudDot} />
                                        <Text style={styles.hudBadgeText}>CÁMARA TRASERA</Text>
                                    </View>
                                    <TouchableOpacity style={styles.torchBtn} onPress={() => setTorch(!torch)}>
                                        <Ionicons name={torch ? "flash" : "flash-outline"} size={18} color={theme.colors.onSurface} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.reticleContainer}>
                                    <View style={[styles.reticleCorner, styles.reticleTL]} />
                                    <View style={[styles.reticleCorner, styles.reticleTR]} />
                                    <View style={[styles.reticleCorner, styles.reticleBL]} />
                                    <View style={[styles.reticleCorner, styles.reticleBR]} />
                                    <View style={styles.laserLine} />
                                    <Ionicons name="scan-outline" size={40} color="rgba(56, 189, 248, 0.5)" />
                                </View>
                                <Text style={styles.hudInstructions}>APUNTE AL QR DEL BOLETO</Text>
                            </View>
                        </View>

                        {/* Entrada Manual */}
                        <View style={styles.manualInputRow}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="keypad" size={18} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.manualInput}
                                    placeholder="Ingresar Código #LMN-..."
                                    placeholderTextColor={theme.colors.onSurfaceVariant}
                                    value={manualCode}
                                    onChangeText={setManualCode}
                                />
                            </View>
                            <TouchableOpacity style={styles.validateBtn} onPress={() => Alert.alert('Validando', manualCode)}>
                                <Text style={styles.validateBtnText}>VALIDAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    lockedContainer: { flex: 1, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
    lockedBox: { alignItems: 'center', padding: theme.spacing.xl },
    lockedIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(56, 189, 248, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.lg },
    lockedTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 24, marginBottom: 8 },
    lockedSubtitle: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 14, textAlign: 'center', marginBottom: 32 },
    authButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: theme.radius.lg, gap: 12, shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5 },
    authButtonText: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 16 },
    header: { padding: theme.spacing.edge, paddingTop: theme.spacing.md },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    shieldIcon: { width: 32, height: 32, borderRadius: theme.radius.md, backgroundColor: 'rgba(56, 189, 248, 0.15)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 20 },
    headerSubtitle: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12 },
    scrollContent: { paddingHorizontal: theme.spacing.edge, paddingBottom: 100, gap: theme.spacing.md },
    authSuccessCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.sm, borderRadius: theme.radius.lg },
    authSuccessLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    fingerprintBox: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
    authSuccessText: { color: theme.colors.tertiary, fontFamily: theme.fonts.mono, fontSize: 10, textTransform: 'uppercase' },
    lockBtn: { width: 36, height: 36, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
    tabsContainer: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, padding: 4, borderRadius: theme.radius.lg },
    tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: theme.radius.md, gap: 8 },
    tabBtnActive: { backgroundColor: theme.colors.primary },
    tabText: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.headline, fontSize: 12, textTransform: 'uppercase' },
    tabTextActive: { color: theme.colors.onPrimary },
    scannerSection: { gap: theme.spacing.md },
    cameraWrapper: { width: '100%', aspectRatio: 3 / 4, borderRadius: theme.radius.xl, overflow: 'hidden', backgroundColor: theme.colors.surfaceContainerLow },
    camera: { flex: 1 },
    noCameraView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noCameraText: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body },
    hudOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'space-between', padding: theme.spacing.md },
    hudHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    hudBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(17, 19, 24, 0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm, gap: 6 },
    hudDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.secondary },
    hudBadgeText: { color: theme.colors.onSurface, fontFamily: theme.fonts.mono, fontSize: 10 },
    torchBtn: { width: 32, height: 32, borderRadius: theme.radius.md, backgroundColor: 'rgba(17, 19, 24, 0.8)', justifyContent: 'center', alignItems: 'center' },
    reticleContainer: { alignSelf: 'center', width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
    reticleCorner: { position: 'absolute', width: 24, height: 24, borderColor: theme.colors.tertiary },
    reticleTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
    reticleTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
    reticleBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
    reticleBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
    laserLine: { position: 'absolute', top: '50%', width: '100%', height: 2, backgroundColor: theme.colors.tertiary, shadowColor: theme.colors.tertiary, shadowOpacity: 1, shadowRadius: 8 },
    hudInstructions: { textAlign: 'center', color: theme.colors.tertiary, fontFamily: theme.fonts.mono, fontSize: 10, backgroundColor: 'rgba(17, 19, 24, 0.8)', paddingVertical: 4, borderRadius: 4, alignSelf: 'center', paddingHorizontal: 8 },
    manualInputRow: { flexDirection: 'row', gap: 8 },
    inputWrapper: { flex: 1, position: 'relative', justifyContent: 'center' },
    inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
    manualInput: { height: 44, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.md, color: theme.colors.onSurface, paddingLeft: 36, paddingRight: 12, fontFamily: theme.fonts.mono, fontSize: 12 },
    validateBtn: { height: 44, paddingHorizontal: 16, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.md, justifyContent: 'center' },
    validateBtnText: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 12 },
    dashboardSection: { gap: theme.spacing.md },
    mainMetricCard: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md, borderRadius: theme.radius.lg, alignItems: 'center', gap: 16, borderLeftWidth: 2, borderLeftColor: theme.colors.primary },
    mainMetricIcon: { width: 48, height: 48, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
    metricLabel: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.mono, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
    metricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    metricValueLarge: { color: theme.colors.onSurface, fontFamily: theme.fonts.display, fontSize: 24 },
    metricCurrency: { color: theme.colors.primary, fontFamily: theme.fonts.mono, fontSize: 12 },
    grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    gridCard: { width: '48%', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md, borderRadius: theme.radius.lg },
    gridCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    gridCardLabel: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12 },
    gridCardValue: { color: theme.colors.onSurface, fontFamily: theme.fonts.display, fontSize: 20 },
    gridCardSub: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 10 },
    chartCard: {width: '100%',backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md,borderRadius: theme.radius.lg, overflow: 'hidden',
    }
});