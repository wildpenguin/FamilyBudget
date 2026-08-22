import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';

import type { Transaction } from './dashboard';

type RecentTransactionsCardProps = {
    data: Transaction[] | undefined;
};

export function RecentTransactionsCard({ data }: RecentTransactionsCardProps) {
    const theme = useTheme();

    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.onSurface }}>
                    Recent transactions
                </Text>
                <Pressable onPress={() => router.push('/(tabs)/transactions')}>
                    <Text style={{ fontSize: 12, color: theme.colors.primary }}>See all</Text>
                </Pressable>
            </View>

            <View>
                {(data ?? []).map((transaction) => {
                    const isPositive = transaction.amount >= 0;
                    const tint = isPositive
                        ? { background: theme.colors.tertiaryContainer, foreground: theme.colors.tertiary }
                        : { background: theme.colors.errorContainer, foreground: theme.colors.error };

                    return (
                        <View key={transaction.id} style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: tint.background }]}>
                                <Icon source={transaction.icon} size={16} color={tint.foreground} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={{ fontSize: 13, color: theme.colors.onSurface }}>{transaction.title}</Text>
                                <Text style={{ fontSize: 11, color: theme.colors.onSurfaceVariant }}>{transaction.date}</Text>
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: tint.foreground }}>
                                {isPositive ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 9,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
});
