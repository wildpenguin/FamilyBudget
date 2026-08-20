import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

const Register = () => {
    return (
        <View style={styles.container}>
            <Text title={true} style={styles.title}>
                Register For an Account
            </Text>
            <Link href='/register'>
                <Text style={{ textAlign: 'center' }}> Register instead</Text>
            </Link>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 30,
    }
})