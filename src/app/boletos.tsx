import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../components/theme';

export default function BoletosScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logoText}>LUMINA CINEMAS</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Banner de Celebración */}
                <View style={styles.celebrationBanner}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.onPrimary} />
                    </View>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerSubtitle}>OPERACIÓN EXITOSA</Text>
                        <Text style={styles.bannerTitle}>¡Reserva Confirmada!</Text>
                        <Text style={styles.bannerBody}>Disfruta la magia de tu función cinematográfica.</Text>
                    </View>
                </View>

                {/* Píldora de Estado */}
                <View style={styles.statusPill}>
                    <View style={styles.statusDotContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Estado: Boleto Activo / No Canjeado</Text>
                    </View>
                </View>

                {/* Tarjeta del Boleto */}
                <View style={styles.ticketCard}>
                    {/* Cabecera con Imagen */}
                    <View style={styles.ticketImageContainer}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ9u71TYllg6pLyhvzCpExcwoGJ_zQwndY_xeFx_KryVIitbUo_Cg4zuG15RxeEn5cag6FnvphaxLBxCVFsiDVLL2Qd4lmXSA-ME8Mu_yVi4p1Qk3scDoAPvX-CkwgtznaCZ7oWyIIh9_ALX6zejRtnZ2dnBl18eb9gqni29JhXXVjgWOBRHrYYXQpRJgJGCwWwS1Va5VowIuHkeUSX_ZUBsCNh8juuzlw0m9w2a7pbKxls1e-wzz0MQ' }}
                            style={styles.ticketImage}
                        />
                        <View style={styles.imageOverlay}>
                            <View style={styles.badgeRow}>
                                <View style={styles.badgeDark}>
                                    <Text style={styles.badgeTextSecondary}>IMAX LÁSER</Text>
                                </View>
                                <View style={styles.badgePrimary}>
                                    <Text style={styles.badgeTextPrimary}>DOLBY ATMOS</Text>
                                </View>
                            </View>
                            <View style={styles.movieDetailsOverlay}>
                                <Text style={styles.movieSubtitle}>ESTRENO EXCLUSIVO</Text>
                                <Text style={styles.movieTitle}>Duna: Parte Dos</Text>
                            </View>
                        </View>
                    </View>

                    {/* Cuadrícula de Información */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>FECHA & HORARIO</Text>
                            <Text style={styles.infoValue}>Hoy, 24 Octubre</Text>
                            <Text style={styles.infoSubValueSecondary}>19:30 hrs</Text>
                        </View>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>UBICACIÓN & SALA</Text>
                            <Text style={styles.infoValue}>Lumina Plaza Real</Text>
                            <Text style={styles.infoSubValueTertiary}>Sala 1 (Planta Alta)</Text>
                        </View>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>BUTACAS ASIGNADAS</Text>
                            <Text style={styles.infoValuePrimary}>Fila F · 05, 06</Text>
                            <Text style={styles.infoSubValue}>2 Boletos Adulto VIP</Text>
                        </View>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>ACCESO ESPECIAL</Text>
                            <View style={styles.iconRow}>
                                <Ionicons name="fast-food" size={14} color={theme.colors.secondary} />
                                <Text style={styles.infoValue}>Fast-Track</Text>
                            </View>
                            <Text style={styles.infoSubValue}>Dulcería Express Incluida</Text>
                        </View>
                    </View>

                    {/* Línea de Perforación (Tear Line) */}
                    <View style={styles.tearLineContainer}>
                        <View style={styles.notchLeft} />
                        <View style={styles.dashedLine} />
                        <View style={styles.notchRight} />
                    </View>

                    {/* Sección del Código QR */}
                    <View style={styles.qrSection}>
                        <View style={styles.qrHeader}>
                            <View style={styles.iconRow}>
                                <Ionicons name="sunny" size={14} color={theme.colors.onSurfaceVariant} />
                                <Text style={styles.qrHeaderText}>Sube tu brillo</Text>
                            </View>
                            <View style={styles.iconRow}>
                                <Ionicons name="lock-closed" size={14} color={theme.colors.tertiary} />
                                <Text style={styles.qrHeaderSecure}>Cifrado Dinámico</Text>
                            </View>
                        </View>

                        <View style={styles.qrBox}>
                            <Ionicons name="qr-code" size={120} color={theme.colors.surfaceContainerLow} />
                        </View>

                        <Text style={styles.qrInstructions}>
                            Muestra este código QR al ingresar a la sala. El personal del cine lo escaneará para validar tu acceso.
                        </Text>

                        <View style={styles.authCodeContainer}>
                            <Text style={styles.authCodeLabel}>Código de Autorización:</Text>
                            <TouchableOpacity style={styles.iconRow}>
                                <Text style={styles.authCodeValue}>8924-DX</Text>
                                <Ionicons name="copy-outline" size={14} color={theme.colors.tertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    header: {
        padding: theme.spacing.edge,
        alignItems: 'flex-start',
    },
    logoText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
        fontSize: 22,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.edge,
        paddingBottom: 40,
        gap: theme.spacing.md,
    },
    celebrationBanner: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceContainerHigh,
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerSubtitle: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
        letterSpacing: 1.2,
    },
    bannerTitle: {
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        fontSize: 18,
        marginVertical: 2,
    },
    bannerBody: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        fontSize: 12,
    },
    statusPill: {
        backgroundColor: theme.colors.surfaceContainerLow,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 8,
        borderRadius: theme.radius.md,
        alignSelf: 'flex-start',
    },
    statusDotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.secondary,
    },
    statusText: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.mono,
        fontSize: 11,
        textTransform: 'uppercase',
    },
    ticketCard: {
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
    },
    ticketImageContainer: {
        width: '100%',
        height: 144,
        backgroundColor: theme.colors.surfaceContainerLow,
    },
    ticketImage: {
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFill,
        padding: theme.spacing.sm,
        justifyContent: 'space-between',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 6,
    },
    badgeDark: {
        backgroundColor: 'rgba(12, 14, 19, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.radius.pill,
    },
    badgePrimary: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.radius.pill,
    },
    badgeTextSecondary: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.mono,
        fontSize: 10,
    },
    badgeTextPrimary: {
        color: theme.colors.onPrimary,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
    },
    movieDetailsOverlay: {
        marginTop: 'auto',
    },
    movieSubtitle: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
        letterSpacing: 1.2,
    },
    movieTitle: {
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.display,
        fontSize: 24,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    infoCell: {
        width: '45%',
        marginBottom: theme.spacing.xs,
    },
    infoLabel: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
        marginBottom: 4,
    },
    infoValue: {
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        fontSize: 14,
    },
    infoValuePrimary: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
        fontSize: 14,
    },
    infoSubValue: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        fontSize: 12,
        marginTop: 2,
    },
    infoSubValueSecondary: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.mono,
        fontSize: 11,
        marginTop: 2,
    },
    infoSubValueTertiary: {
        color: theme.colors.tertiary,
        fontFamily: theme.fonts.mono,
        fontSize: 11,
        marginTop: 2,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tearLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 32,
        backgroundColor: theme.colors.surfaceContainerHigh,
    },
    notchLeft: {
        width: 16,
        height: 32,
        backgroundColor: theme.colors.surface,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        marginLeft: -2,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.onSurfaceVariant,
        marginHorizontal: 12,
        opacity: 0.4,
    },
    notchRight: {
        width: 16,
        height: 32,
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        marginRight: -2,
    },
    qrSection: {
        padding: theme.spacing.md,
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerHigh,
    },
    qrHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: theme.spacing.md,
    },
    qrHeaderText: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.headline,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    qrHeaderSecure: {
        color: theme.colors.tertiary,
        fontFamily: theme.fonts.mono,
        fontSize: 11,
    },
    qrBox: {
        backgroundColor: '#ffffff',
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrInstructions: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        fontSize: 12,
        textAlign: 'center',
        marginTop: theme.spacing.md,
        lineHeight: 18,
    },
    authCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: theme.spacing.sm,
    },
    authCodeLabel: {
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.mono,
        fontSize: 11,
    },
    authCodeValue: {
        color: theme.colors.tertiary,
        fontFamily: theme.fonts.mono,
        fontSize: 12,
        textDecorationLine: 'underline',
    }
});