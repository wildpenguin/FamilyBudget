import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { AddSheetProvider } from "../src/shared/context/AddSheetContext";
import { AuthProvider } from "../src/shared/context/AuthContext";
import { colors } from "../src/shared/theme";

const queryClient = new QueryClient();

const theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: colors.primary,
		background: colors.background,
		surface: colors.surface,
		outline: colors.border,
		outlineVariant: colors.outlineVariant,
		onSurface: colors.text,
		onSurfaceVariant: colors.textMuted,
		error: colors.danger,
	},
};

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider theme={theme}>
				<AuthProvider>
					<AddSheetProvider>
						<Slot />
					</AddSheetProvider>
				</AuthProvider>
			</PaperProvider>
		</QueryClientProvider>
	);
}
