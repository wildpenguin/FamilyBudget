import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
	Avatar,
	Button,
	HelperText,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { useAuth } from "../../src/shared/context/AuthContext";

export default function Register() {
	const { register } = useAuth();
	const theme = useTheme();

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [secureText, setSecureText] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const hasError = !!error;

	async function handleRegister(): Promise<void> {
		if (!name || !email || !password) {
			setError("Please fill in your name, email, and password");
			return;
		}

		try {
			setError(null);
			setIsSubmitting(true);
			await register(email, password, name);
			router.replace("/(tabs)");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			style={[styles.flex, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.container}>
				<Avatar.Icon
					icon="wallet"
					size={72}
					style={{ backgroundColor: theme.colors.primary }}
				/>

				<Text variant="headlineMedium" style={styles.title}>
					Family Budget
				</Text>
				<Text variant="bodyMedium" style={styles.subtitle}>
					Create an account to get started
				</Text>

				<TextInput
					label="Name"
					value={name}
					onChangeText={(text) => {
						setName(text);
						if (error) setError(null);
					}}
					mode="outlined"
					autoCapitalize="words"
					left={<TextInput.Icon icon="account" />}
					style={styles.input}
				/>

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
							icon={secureText ? "eye" : "eye-off"}
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
					onPress={handleRegister}
					loading={isSubmitting}
					disabled={isSubmitting}
					style={styles.button}
					contentStyle={styles.buttonContent}
				>
					{isSubmitting ? "Creating account..." : "Register"}
				</Button>

				<View style={styles.footer}>
					<Text variant="bodyMedium">Already have an account? </Text>
					<Link href="/(auth)/login" asChild>
						<Text
							variant="bodyMedium"
							style={{ color: theme.colors.primary, fontWeight: "600" }}
						>
							Log In
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
		justifyContent: "center",
		paddingHorizontal: 24,
		alignItems: "center",
	},
	title: {
		marginTop: 16,
		fontWeight: "bold",
	},
	subtitle: {
		marginTop: 4,
		marginBottom: 32,
		opacity: 0.7,
	},
	input: {
		width: "100%",
		marginBottom: 4,
	},
	button: {
		width: "100%",
		marginTop: 12,
		borderRadius: 8,
	},
	buttonContent: {
		paddingVertical: 6,
	},
	footer: {
		flexDirection: "row",
		marginTop: 24,
		alignItems: "center",
	},
});
