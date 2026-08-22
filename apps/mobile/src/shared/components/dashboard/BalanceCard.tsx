import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import type { BalanceSummary } from './dashboard';

type BalanceCardProps = {
    data: BalanceSummary | undefined;
    isLoading: boolean;
};

export function BalanceCard({ data, isLoading }: BalanceCardProps) {
    const theme = useTheme();
    const [isHidden, setIsHidden] = useState(false);

    const formattedBalance = data
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.currentBalance)
        : '—';

    const isPositiveTrend = (data?.percentChangeVsLastMonth ?? 0) >= 0;

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.label, { color: theme.colors.onPrimary }]}>Current Balance</Text>
                <IconButton
                    icon={isHidden ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    iconColor={theme.colors.onPrimary}
                    onPress={() => setIsHidden((prev) => !prev)}
                    style={styles.eyeButton}
                />
            </View>

            {isLoading ? (
                <ActivityIndicator color={theme.colors.onPrimary} style={styles.loader} />
            ) : (
                <Text style={[styles.balance, { color: theme.colors.onPrimary }]}>
                    {isHidden ? '••••••' : formattedBalance}
                </Text>
            )}

            {data && !isLoading && (
                <View style={styles.trendRow}>
                    <View style={styles.trendPill}>
                        <Icon
                            source={isPositiveTrend ? 'trending-up' : 'trending-down'}
                            size={12}
                            color={theme.colors.onPrimary}
                        />
                        <Text style={[styles.trendText, { color: theme.colors.onPrimary }]}>
                            {isPositiveTrend ? '+' : ''}
                            {data.percentChangeVsLastMonth}%
                        </Text>
                    </View>
                    <Text style={[styles.trendCaption, { color: theme.colors.onPrimary }]}>vs last month</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 13,
        opacity: 0.85,
    },
    eyeButton: {
        margin: 0,
    },
    balance: {
        fontSize: 34,
        fontWeight: '700',
        marginTop: 2,
    },
    loader: {
        alignSelf: 'flex-start',
        marginTop: 12,
        marginBottom: 10,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    trendText: {
        fontSize: 11,
        fontWeight: '600',
    },
    trendCaption: {
        fontSize: 11,
        opacity: 0.8,
    },
});
