import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AddSheetProvider } from "../src/shared/context/AddSheetContext";
import { AuthProvider } from "../src/shared/context/AuthContext";
import { theme } from "../src/shared/theme";

const queryClient = new QueryClient();

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
