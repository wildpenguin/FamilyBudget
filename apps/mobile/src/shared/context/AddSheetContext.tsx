import { BottomSheet } from "@expo/ui";
import { router } from "expo-router";
import { createContext, type ReactNode, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	Divider,
	Icon,
	type MD3Theme,
	Text,
	TouchableRipple,
	useTheme,
} from "react-native-paper";

// --- Types ---

type AddSheetContextType = {
	isOpen: boolean;
	openAddSheet: () => void;
	closeAddSheet: () => void;
};

type AddSheetProviderProps = {
	children: ReactNode;
};

type Tint = "accent" | "success" | "danger";

type AddDestination = {
	label: string;
	subtitle: string;
	icon: string;
	route: "/add/categories" | "/add/income" | "/add/expense";
	tint: Tint;
};

const DESTINATIONS: AddDestination[] = [
	{
		label: "Income",
		subtitle: "Log money coming in",
		icon: "arrow-up-bold",
		route: "/add/income",
		tint: "success",
	},
	{
		label: "Expenses",
		subtitle: "Log money going out",
		icon: "arrow-down-bold",
		route: "/add/expense",
		tint: "danger",
	},
	{
		label: "Categories",
		subtitle: "Manage spending categories",
		icon: "tag-multiple-outline",
		route: "/add/categories",
		tint: "accent",
	},
];

// --- Context ---

const AddSheetContext = createContext<AddSheetContextType | null>(null);

// --- Provider ---
// Mounted once at the app root so the sheet is available regardless of
// which tab is active — the "Add" tab press opens it instead of navigating.

export function AddSheetProvider({ children }: AddSheetProviderProps) {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useTheme();

	function openAddSheet(): void {
		setIsOpen(true);
	}

	function closeAddSheet(): void {
		setIsOpen(false);
	}

	function navigateTo(route: AddDestination["route"]): void {
		closeAddSheet();
		router.push(route);
	}

	return (
		<AddSheetContext.Provider value={{ isOpen, openAddSheet, closeAddSheet }}>
			{children}

			<BottomSheet
				isPresented={isOpen}
				onDismiss={closeAddSheet}
				showDragIndicator
			>
				<View style={styles.sheetContent}>
					<Text
						variant="titleMedium"
						style={[styles.title, { color: theme.colors.onSurface }]}
					>
						Quick Add
					</Text>

					{DESTINATIONS.map((destination, index) => (
						<View key={destination.route}>
							<AddSheetRow
								destination={destination}
								theme={theme}
								onPress={() => navigateTo(destination.route)}
							/>
							{index < DESTINATIONS.length - 1 && (
								<Divider
									style={[
										styles.divider,
										{ backgroundColor: theme.colors.outlineVariant },
									]}
								/>
							)}
						</View>
					))}
				</View>
			</BottomSheet>
		</AddSheetContext.Provider>
	);
}

// --- Row ---

type AddSheetRowProps = {
	destination: AddDestination;
	theme: MD3Theme;
	onPress: () => void;
};

function AddSheetRow({ destination, theme, onPress }: AddSheetRowProps) {
	const { background, foreground } = getTintColors(destination.tint, theme);

	return (
		<TouchableRipple
			onPress={onPress}
			borderless
			style={styles.row}
			rippleColor={theme.colors.surfaceVariant}
		>
			<View style={styles.rowContent}>
				<View style={[styles.iconCircle, { backgroundColor: background }]}>
					<Icon source={destination.icon} size={20} color={foreground} />
				</View>

				<View style={styles.textContainer}>
					<Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
						{destination.label}
					</Text>
					<Text
						variant="bodySmall"
						style={{ color: theme.colors.onSurfaceVariant }}
					>
						{destination.subtitle}
					</Text>
				</View>

				<Icon
					source="chevron-right"
					size={18}
					color={theme.colors.onSurfaceVariant}
				/>
			</View>
		</TouchableRipple>
	);
}

// Maps each destination's semantic tint to theme colors.
// MD3 doesn't ship a "success" role by default, so that one falls back
// to a fixed green pair — see the note at the bottom of this file if you
// want it to come from your theme instead.
function getTintColors(
	tint: Tint,
	theme: MD3Theme,
): { background: string; foreground: string } {
	switch (tint) {
		case "success":
			return { background: "#DCFCE7", foreground: "#16A34A" };
		case "danger":
			return {
				background: theme.colors.errorContainer,
				foreground: theme.colors.error,
			};
		case "accent":
		default:
			return {
				background: theme.colors.primaryContainer,
				foreground: theme.colors.primary,
			};
	}
}

// --- Styles ---

const styles = StyleSheet.create({
	sheetContent: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 24,
	},
	title: {
		fontWeight: "600",
		marginBottom: 4,
	},
	row: {
		borderRadius: 12,
	},
	rowContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		paddingVertical: 12,
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	textContainer: {
		flex: 1,
	},
	divider: {
		marginLeft: 54,
	},
});

// --- Hook ---

export function useAddSheet(): AddSheetContextType {
	const context = useContext(AddSheetContext);

	if (!context) {
		throw new Error("useAddSheet must be used within an AddSheetProvider");
	}

	return context;
}
