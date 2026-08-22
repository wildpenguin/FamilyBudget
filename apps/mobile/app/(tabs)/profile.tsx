import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Divider, Text, useTheme } from "react-native-paper";
import { useAuth } from "../../src/shared/context/AuthContext";

export default function ProfileScreen() {
	const { user, logout } = useAuth();
	const theme = useTheme();
	const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

	async function handleLogout(): Promise<void> {
		try {
			setIsLoggingOut(true);
			await logout();
			router.replace("/(auth)/login");
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<Avatar.Icon
				icon="account"
				size={72}
				style={{ backgroundColor: theme.colors.primary }}
			/>

			<Text variant="headlineSmall" style={styles.name}>
				{user?.name ?? "—"}
			</Text>

			<View style={styles.infoList}>
				<View style={styles.infoRow}>
					<Text variant="bodyMedium" style={styles.label}>
						Name
					</Text>
					<Text variant="bodyMedium">{user?.name ?? "—"}</Text>
				</View>

				<Divider />

				<View style={styles.infoRow}>
					<Text variant="bodyMedium" style={styles.label}>
						Email
					</Text>
					<Text variant="bodyMedium">{user?.email ?? "-"}</Text>
				</View>
			</View>

			<Button
				mode="contained"
				icon="logout"
				onPress={handleLogout}
				loading={isLoggingOut}
				disabled={isLoggingOut}
				style={styles.logoutButton}
				contentStyle={styles.logoutButtonContent}
			>
				{isLoggingOut ? "Logging out..." : "Log Out"}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 48,
		paddingHorizontal: 24,
	},
	name: {
		marginTop: 16,
		fontWeight: "bold",
	},
	infoList: {
		width: "100%",
		marginTop: 32,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	label: {
		opacity: 0.6,
	},
	placeholder: {
		fontStyle: "italic",
		opacity: 0.5,
	},
	logoutButton: {
		marginTop: 32,
		borderRadius: 8,
	},
	logoutButtonContent: {
		paddingVertical: 6,
	},
});
