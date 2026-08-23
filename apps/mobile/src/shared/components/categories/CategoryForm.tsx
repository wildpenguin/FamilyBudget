import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, SegmentedButtons, TextInput } from 'react-native-paper';

import type { CategoryType, CreateCategoryInput } from './category';

type CategoryFormProps = {
    onSave: (input: CreateCategoryInput) => void;
    isSaving: boolean;
};

export function CategoryForm({ onSave, isSaving }: CategoryFormProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState<CategoryType>('expense');
    const [touched, setTouched] = useState(false);

    const trimmedName = name.trim();
    const hasError = touched && trimmedName.length === 0;

    function handleSave(): void {
        setTouched(true);
        if (trimmedName.length === 0) {
            return;
        }
        onSave({ name: trimmedName, type });
        setName('');
        setType('expense');
        setTouched(false);
    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Category name"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    if (touched) setTouched(false);
                }}
                mode="outlined"
                placeholder="e.g. Subscriptions"
                error={hasError}
            />
            <HelperText type="error" visible={hasError}>
                Category name is required
            </HelperText>

            <SegmentedButtons
                value={type}
                onValueChange={(value) => setType(value as CategoryType)}
                style={styles.segmented}
                buttons={[
                    { value: 'expense', label: 'Expense', icon: 'arrow-down' },
                    { value: 'income', label: 'Income', icon: 'arrow-up' },
                ]}
            />

            <Button
                mode="contained"
                onPress={handleSave}
                loading={isSaving}
                disabled={isSaving}
                style={styles.saveButton}
                contentStyle={styles.saveButtonContent}
            >
                Save category
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 4,
    },
    segmented: {
        marginTop: 8,
        marginBottom: 16,
    },
    saveButton: {
        borderRadius: 8,
    },
    saveButtonContent: {
        paddingVertical: 4,
    },
});
