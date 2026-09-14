import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from './theme';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { canjearBoleto } from '../redux/slices/reservasSlice';

export default function StaffScanner() {
    const dispatch = useAppDispatch();
    const [permission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [scanned, setScanned] = useState(false);

    const reservasRedux = useAppSelector(state => state.reservas.lista);

    if (!permission) return <View />;
    if (!permission.granted) {
        requestPermission();
        return (
            <View style={styles.noCameraView}>
                <Text style={styles.noCameraText}>Solicitando acceso a la cámara...</Text>
            </View>
        );
    }

    const procesarBoleto = (codigoCrudo: string) => {
        let reservaId = codigoCrudo;
        try {
            const qrData = JSON.parse(codigoCrudo);
            if (qrData.reservaId) reservaId = qrData.reservaId;
        } catch (e) {}

        const reserva = reservasRedux.find(r => r.id === reservaId || r.codigo === reservaId);

        if (!reserva) {
            Alert.alert('Error', 'Boleto no encontrado en el sistema.', [{ text: 'Continuar', onPress: () => setScanned(false) }]);
            return;
        }

        if (reserva.canjeado) {
            Alert.alert('Boleto Inválido', 'Este boleto YA FUE CANJEADO.', [{ text: 'Entendido', style: 'destructive', onPress: () => setScanned(false) }]);
        } else {
            dispatch(canjearBoleto(reserva.id));
            Alert.alert('Acceso Concedido', 'Boleto validado y canjeado exitosamente.', [{ text: 'Siguiente QR', onPress: () => setScanned(false) }]);
        }
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        procesarBoleto(data);
    };

    const handleManualSubmit = () => {
        if (!manualCode.trim()) return;
        setScanned(true);
        procesarBoleto(manualCode);
        setManualCode('');
    };

    return (
        <View style={styles.scannerSection}>
            <View style={styles.cameraWrapper}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    enableTorch={torch}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
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
                        <View style={[styles.laserLine, scanned && { backgroundColor: theme.colors.outline, shadowColor: 'transparent' }]} />
                        <Ionicons name="scan-outline" size={40} color="rgba(56, 189, 248, 0.5)" />
                    </View>
                    <Text style={styles.hudInstructions}>{scanned ? "PROCESANDO..." : "APUNTE AL QR DEL BOLETO"}</Text>
                </View>
            </View>

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
                <TouchableOpacity style={styles.validateBtn} onPress={handleManualSubmit}>
                    <Text style={styles.validateBtnText}>VALIDAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scannerSection: { gap: theme.spacing.md },
    cameraWrapper: { width: '100%', aspectRatio: 3 / 4, borderRadius: theme.radius.xl, overflow: 'hidden', backgroundColor: theme.colors.surfaceContainerLow },
    camera: { flex: 1 },
    noCameraView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerLow, borderRadius: theme.radius.xl, aspectRatio: 3/4 },
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
});