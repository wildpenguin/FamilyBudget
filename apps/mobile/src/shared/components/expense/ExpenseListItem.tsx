import { StyleSheet, View } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import { centsToDollars } from '../../utils/money';


type ExpenseListItemProps = {
    expense: Expense;
    onDelete: (id: string) => void;
    isDeleting: boolean;
};

function formatDate(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ExpenseListItem({ expense, onDelete, isDeleting }: ExpenseListItemProps) {
    const theme = useTheme();

    return (
        <View style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.errorContainer }]}>
                <Icon source="arrow-down" size={16} color={theme.colors.error} />
            </View>

            <View style={styles.textContainer}>
                <Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
                    {expense.description}
                </Text>
                <Text style={{ fontSize: 11, color: theme.colors.onSurfaceVariant, marginTop: 1 }}>
                    {expense.categoryId} · {formatDate(expense.date)}
                </Text>
            </View>

            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.error, marginRight: 4 }}>
                -${centsToDollars(expense.amountCents)}
            </Text>

            <IconButton icon="trash-can-outline" size={18} onPress={() => onDelete(expense.id)} disabled={isDeleting} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
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
