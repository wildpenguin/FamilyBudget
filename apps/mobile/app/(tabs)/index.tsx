import { StyleSheet, Text, View } from 'react-native';

export default function BudgetsScreen() {
  return (
    <View style={styles.container}>
      <Text>Budgets</Text>
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
