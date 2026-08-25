import { Platform } from "react-native";
import { TOKEN_KEY } from "../constants";
import { storage } from "./storage";

function resolveApiPrefix(): string {
	if (Platform.OS === "web") {
		return process.env.EXPO_PUBLIC_API_URL_WEB;
	}
	/** fit more scenarios when service android, ios... */

	return process.env.EXPO_PUBLIC_API_URL_WEB;
}

export const API_PREFIX = resolveApiPrefix();

export async function apiFetch(url: string, options: RequestInit = {}) {
	const token = await storage.getItem(TOKEN_KEY);
	if (!token) {
		throw new Error("No authentication token can be found");
	}
	const apiUrl = `${API_PREFIX}/api/${url.replace(/^\/+/, "")}`;

	const response = await fetch(apiUrl, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`API error: ' ${response.status}`);
	}

	return response.json();
}
