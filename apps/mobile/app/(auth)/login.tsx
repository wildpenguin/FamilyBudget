import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import {
    TextInput,
    Button,
    Text,
    HelperText,
    Avatar,
    useTheme,
} from 'react-native-paper';
import { useAuth } from '../../src/shared/context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const theme = useTheme();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureText, setSecureText] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const hasError = !!error;

    async function handleLogin(): Promise<void> {
        if (!email || !password) {
        setError('Please enter both email and password');
        return;
        }

        try {
            setError(null);
            setIsSubmitting(true);
            await login(email, password);
            router.replace('/(tabs)');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <Avatar.Icon
          icon="money"
          size={72}
          style={{ backgroundColor: theme.colors.primary }}
        />

        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Log in to continue
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError(null);
          }}
          mode="outlined"
          secureTextEntry={secureText}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={secureText ? 'eye' : 'eye-off'}
              onPress={() => setSecureText((prev) => !prev)}
            />
          }
          style={styles.input}
        />

        <HelperText type="error" visible={hasError}>
          {error}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>

        <View style={styles.footer}>
          <Text variant="bodyMedium">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Register
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 32,
    opacity: 0.7,
  },
  input: {
    width: '100%',
    marginBottom: 4,
  },
  button: {
    width: '100%',
    marginTop: 12,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
});