import { Platform } from "react-native";

function resolveApiUrl(): string {
	console.log("url=", process.env.EXPO_PUBLIC_API_URL_WEB);
	if (Platform.OS === "web") {
		return process.env.EXPO_PUBLIC_API_URL_WEB;
	}
	/** fit more scenarios when service android, ios... */

	return process.env.EXPO_PUBLIC_API_URL_WEB;
}

export const API_URL = resolveApiUrl();
