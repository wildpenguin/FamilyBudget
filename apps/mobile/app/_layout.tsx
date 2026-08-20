import { Slot } from "expo-router";
import { AuthProvider } from "../src/shared/context/AuthContext";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
	return (
		<PaperProvider>
			<AuthProvider>
				<Slot />
			</AuthProvider>
		</PaperProvider>
	);
}
