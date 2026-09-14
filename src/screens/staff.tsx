import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFocusEffect } from "@react-navigation/native";
import { theme } from '../components/theme';

// Importamos los nuevos componentes modulares
import StaffDashboard from '../components/Dashboard';
import StaffScanner from '../components/StaffScanner';

export default function StaffScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'scanner' | 'dashboard'>('scanner');

    useFocusEffect(
        useCallback(() => {
            setIsAuthenticated(false);
            authenticateStaff();
            return () => setIsAuthenticated(false);
        }, [])
    );

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
            } else {
                Alert.alert('Acceso Denegado', 'No se pudo verificar la identidad.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const lockTerminal = () => setIsAuthenticated(false);

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

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

                {/* Renderizado Condicional Modular */}
                {activeTab === 'dashboard' ? <StaffDashboard /> : <StaffScanner />}

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
    tabTextActive: { color: theme.colors.onPrimary }
});