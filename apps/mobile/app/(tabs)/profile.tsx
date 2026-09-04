import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	Avatar,
	Button,
	Dialog,
	Divider,
	HelperText,
	Portal,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../src/shared/context/AuthContext";
import { API_PREFIX, apiFetch } from "../../src/shared/utils/apiConfig";

export default function ProfileScreen() {
	const { user, logout } = useAuth();
	const theme = useTheme();
	const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

	const [isInviteDialogVisible, setIsInviteDialogVisible] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [isInviting, setIsInviting] = useState(false);
	const [inviteUrl, setInviteUrl] = useState<string | null>(null);

	async function handleLogout(): Promise<void> {
		try {
			setIsLoggingOut(true);
			await logout();
			router.replace("/(auth)/login");
		} finally {
			setIsLoggingOut(false);
		}
	}

	function openInviteDialog(): void {
		setInviteEmail("");
		setInviteError(null);
		setInviteUrl(null);
		setIsInviteDialogVisible(true);
	}

	function closeInviteDialog(): void {
		setIsInviteDialogVisible(false);
	}

	async function handleCreateInvite(): Promise<void> {
		if (!inviteEmail) {
			setInviteError("Please enter the family member's email");
			return;
		}
		try {
			setInviteError(null);
			setIsInviting(true);
			const response = await apiFetch("/familyInvites", {
				method: "POST",
				body: JSON.stringify({ invitedEmail: inviteEmail }),
			});
			setInviteUrl(
				`${API_PREFIX}/api/familyInvites/${response.data.token}/accept`,
			);
		} catch (err) {
			setInviteError(
				err instanceof Error ? err.message : "Something went wrong",
			);
		} finally {
			setIsInviting(false);
		}
	}

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<Avatar.Icon
				icon="account-outline"
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
				mode="outlined"
				icon="qrcode"
				onPress={openInviteDialog}
				style={styles.inviteButton}
				contentStyle={styles.logoutButtonContent}
			>
				Invite Family Member
			</Button>

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

			<Portal>
				<Dialog visible={isInviteDialogVisible} onDismiss={closeInviteDialog}>
					<Dialog.Title>Invite Family Member</Dialog.Title>
					<Dialog.Content>
						{inviteUrl ? (
							<View style={styles.qrContainer}>
								<QRCode value={inviteUrl} size={200} />
								<Text variant="bodySmall" style={styles.qrHint}>
									Scan this code from the invited member's device to join your
									family.
								</Text>
							</View>
						) : (
							<>
								<Text variant="bodyMedium" style={styles.dialogSubtitle}>
									They must already have an OurBudget account.
								</Text>
								<TextInput
									label="Email"
									value={inviteEmail}
									onChangeText={(text) => {
										setInviteEmail(text);
										if (inviteError) setInviteError(null);
									}}
									mode="outlined"
									autoCapitalize="none"
									keyboardType="email-address"
									left={<TextInput.Icon icon="email" />}
								/>
								<HelperText type="error" visible={!!inviteError}>
									{inviteError}
								</HelperText>
							</>
						)}
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={closeInviteDialog}>
							{inviteUrl ? "Done" : "Cancel"}
						</Button>
						{!inviteUrl && (
							<Button
								onPress={handleCreateInvite}
								loading={isInviting}
								disabled={isInviting}
							>
								Generate QR Code
							</Button>
						)}
					</Dialog.Actions>
				</Dialog>
			</Portal>
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
	inviteButton: {
		marginTop: 32,
		borderRadius: 8,
		width: "100%",
	},
	logoutButton: {
		marginTop: 12,
		borderRadius: 8,
		width: "100%",
	},
	logoutButtonContent: {
		paddingVertical: 6,
	},
	dialogSubtitle: {
		opacity: 0.7,
		marginBottom: 16,
	},
	qrContainer: {
		alignItems: "center",
		paddingVertical: 8,
	},
	qrHint: {
		marginTop: 16,
		textAlign: "center",
		opacity: 0.7,
	},
});
