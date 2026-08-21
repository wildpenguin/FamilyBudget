import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../src/shared/context/AuthContext";

export default function RootLayout() {
	return (
		<PaperProvider>
			<AuthProvider>
				<Slot />
			</AuthProvider>
		</PaperProvider>
	);
}
