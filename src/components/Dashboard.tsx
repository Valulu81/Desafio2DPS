import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { theme } from './theme';
import { useAppSelector } from '../redux/hooks';
import { salas } from '../data/salas';

export default function StaffDashboard() {
    const navigation = useNavigation<any>();
    const [chartContainerWidth, setChartContainerWidth] = useState(0);

    const peliculasRedux = useAppSelector(state => state.peliculas);
    const funcionesRedux = useAppSelector(state => state.funciones);
    const reservasRedux = useAppSelector(state => state.reservas.lista);

    // Centralizamos los cálculos en useMemo para garantizar que reaccionen a Redux
    const {
        totalPeliculas,
        totalFunciones,
        totalBoletosVendidos,
        ingresosGenerados,
        totalAsientosDisponibles,
        totalAsientosOcupados,
        peliculaMasReservada,
        dataGrafico
    } = useMemo(() => {
        const tPeliculas = peliculasRedux.length;
        const tFunciones = funcionesRedux.length;
        const tBoletos = reservasRedux.reduce((sum, r) => sum + r.boletos, 0);
        const tIngresos = reservasRedux.reduce((sum, r) => sum + r.monto, 0);

        let tDisponibles = 0;
        let tOcupados = 0;

        funcionesRedux.forEach(f => {
            // Protección contra errores de mayúsculas/minúsculas ("S1" vs "s1")
            const sala = salas.find(s => s.id.toLowerCase() === f.salaId.toLowerCase());
            if (!sala) return;

            const capacidad = sala.filas * sala.columnas;
            if (f.asientos && f.asientos.length > 0) {
                const ocupados = f.asientos.filter(a => a.estado === 'ocupado').length;
                tOcupados += ocupados;
                tDisponibles += (capacidad - ocupados);
            } else {
                tDisponibles += capacidad;
            }
        });

        const ingresosPorPeli: Record<string, number> = {};
        reservasRedux.forEach(r => {
            ingresosPorPeli[r.pelicula] = (ingresosPorPeli[r.pelicula] || 0) + r.monto;
        });

        const pMasReservada = Object.entries(
            reservasRedux.reduce((acc: Record<string, number>, r) => {
                acc[r.pelicula] = (acc[r.pelicula] || 0) + r.boletos;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1])[0];

        const dGrafico = Object.entries(ingresosPorPeli).map(([nombre, monto]) => ({
            value: monto,
            label: nombre.length > 8 ? nombre.substring(0, 8) + '…' : nombre,
            frontColor: theme.colors.primary,
        }));

        return {
            totalPeliculas: tPeliculas,
            totalFunciones: tFunciones,
            totalBoletosVendidos: tBoletos,
            ingresosGenerados: tIngresos,
            totalAsientosDisponibles: tDisponibles,
            totalAsientosOcupados: tOcupados,
            peliculaMasReservada: pMasReservada,
            dataGrafico: dGrafico
        };
    }, [peliculasRedux, funcionesRedux, reservasRedux]);

    return (
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

            <View style={styles.chartCard} onLayout={(event) => setChartContainerWidth(event.nativeEvent.layout.width)}>
                <View style={styles.gridCardHeader}>
                    <Text style={styles.gridCardLabel}>Ingresos por película</Text>
                    <Ionicons name="bar-chart" size={18} color={theme.colors.primary} />
                </View>

                {dataGrafico.length > 0 && chartContainerWidth > 0 ? (
                    <BarChart
                        key={JSON.stringify(dataGrafico)}
                        data={dataGrafico}
                        width={chartContainerWidth}
                        barWidth={28}
                        spacing={32} 
                        initialSpacing={16}
                        roundedTop
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                        noOfSections={4}
                        height={180}
                        isAnimated
                    />
                ) : (
                    <Text style={styles.gridCardSub}>Aún no hay ventas registradas</Text>
                )}
            </View>

            <TouchableOpacity style={styles.btnCatalogo} onPress={() => navigation.navigate('FormularioPeliculaScreen')}>
                <Ionicons name="film-outline" size={20} color={theme.colors.onPrimary} />
                <Text style={styles.btnCatalogoTexto}>Gestión de Catálogo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    dashboardSection: { gap: theme.spacing.md },
    mainMetricCard: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md, borderRadius: theme.radius.lg, alignItems: 'center', gap: 16, borderLeftWidth: 2, borderLeftColor: theme.colors.primary },
    mainMetricIcon: { width: 48, height: 48, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
    metricLabel: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.mono, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
    metricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    metricValueLarge: { color: theme.colors.onSurface, fontFamily: theme.fonts.display, fontSize: 24 },
    grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    gridCard: { width: '48%', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md, borderRadius: theme.radius.lg },
    gridCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    gridCardLabel: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12 },
    gridCardValue: { color: theme.colors.onSurface, fontFamily: theme.fonts.display, fontSize: 20 },
    gridCardSub: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 10 },
    chartCard: { width: '100%', backgroundColor: theme.colors.surfaceContainer, padding: theme.spacing.md, borderRadius: theme.radius.lg, overflow: 'hidden' },
    btnCatalogo: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: theme.radius.lg, marginTop: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    btnCatalogoTexto: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 16, textTransform: 'uppercase' }
});