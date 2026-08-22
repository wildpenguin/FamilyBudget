import { router, Stack } from 'expo-router';
import { IconButton } from 'react-native-paper';

export default function AddStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerRight: () => (
                    <IconButton icon="home" onPress={() => router.replace('/(tabs)')} />
                ),
            }}
        >
            <Stack.Screen name="categories" options={{ title: 'Add Category' }} />
            <Stack.Screen name="income" options={{ title: 'Add Income' }} />
            <Stack.Screen name="expense" options={{ title: 'Add Expense' }} />
        </Stack>
    );
}
