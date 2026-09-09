import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../components/theme';


const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 8;
const OCCUPIED_SEATS = ['A5', 'A6', 'B3', 'C1', 'F6'];

export default function SeleccionAsientos() {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const toggleSeat = (seatId: string) => {
        if (OCCUPIED_SEATS.includes(seatId)) return;
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Información de la función */}
            <View style={styles.headerInfo}>
                <Text style={styles.movieTitle}>Duna: Parte Dos</Text>
                <Text style={styles.metaData}>Sala 1 • Hoy, 19:30 hrs</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollArea}>
                {/* Arco de la Pantalla */}
                <View style={styles.screenContainer}>
                    <View style={styles.screenArc} />
                    <Text style={styles.screenText}>PANTALLA</Text>
                </View>

                {/* Matriz de Asientos */}
                <View style={styles.gridContainer}>
                    {ROWS.map(row => (
                        <View key={row} style={styles.row}>
                            <Text style={styles.rowLabel}>{row}</Text>
                            <View style={styles.seatsContainer}>
                                {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                                    const seatNum = i + 1;
                                    const seatId = `${row}${seatNum}`;
                                    const isOccupied = OCCUPIED_SEATS.includes(seatId);
                                    const isSelected = selectedSeats.includes(seatId);
                                    const isAisle = seatNum === 4; // Pasillo central

                                    return (
                                        <React.Fragment key={seatId}>
                                            <TouchableOpacity
                                                disabled={isOccupied}
                                                onPress={() => toggleSeat(seatId)}
                                                style={[
                                                    styles.seat,
                                                    isOccupied && styles.seatOccupied,
                                                    isSelected && styles.seatSelected
                                                ]}
                                            />
                                            {isAisle && <View style={styles.aisle} />}
                                        </React.Fragment>
                                    );
                                })}
                            </View>
                            <Text style={styles.rowLabel}>{row}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Dock de Checkout Inferior */}
            <View style={styles.checkoutDock}>
                <View>
                    <Text style={styles.checkoutTotal}>${selectedSeats.length * 160} MXN</Text>
                    <Text style={styles.checkoutSub}>{selectedSeats.length} Boletos Seleccionados</Text>
                </View>
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    headerInfo: { padding: theme.spacing.edge },
    movieTitle: { color: theme.colors.onSurface, fontFamily: theme.fonts.headline, fontSize: 22 },
    metaData: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 14, marginTop: 4 },
    scrollArea: { alignItems: 'center', paddingBottom: 100 },
    screenContainer: { alignItems: 'center', marginBottom: theme.spacing.lg, width: '80%' },
    screenArc: { width: '100%', height: 40, borderTopWidth: 4, borderTopColor: theme.colors.primary, borderTopLeftRadius: 150, borderTopRightRadius: 150, opacity: 0.8 },
    screenText: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.mono, fontSize: 10, marginTop: -20, letterSpacing: 4 },
    gridContainer: { gap: 12 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    rowLabel: { color: theme.colors.outline, fontFamily: theme.fonts.mono, fontSize: 14, width: 20, textAlign: 'center' },
    seatsContainer: { flexDirection: 'row', gap: 6 },
    seat: { width: 28, height: 28, borderRadius: 6, backgroundColor: theme.colors.surfaceContainerHigh },
    seatOccupied: { backgroundColor: theme.colors.surfaceContainerLow, opacity: 0.5 },
    seatSelected: { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOpacity: 0.8, shadowRadius: 8, elevation: 5 },
    aisle: { width: 16 },
    checkoutDock: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surfaceContainerHigh, padding: theme.spacing.edge, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.colors.surfaceContainer },
    checkoutTotal: { color: theme.colors.onSurface, fontFamily: theme.fonts.display, fontSize: 24 },
    checkoutSub: { color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.body, fontSize: 12 },
    payButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: theme.radius.lg },
    payButtonText: { color: theme.colors.onPrimary, fontFamily: theme.fonts.headline, fontSize: 16, fontWeight: 'bold' }
});