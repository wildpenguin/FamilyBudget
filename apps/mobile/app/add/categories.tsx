import { StyleSheet, Text, View } from 'react-native';

export default function AddCategoryScreen() {
    return (
        <View style={styles.container}>
            <Text>Add Category</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
