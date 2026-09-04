import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { TOKEN_KEY, USER_KEY } from "../constants";
import { API_PREFIX } from "../utils/apiConfig";
import { registerLogoutHandler } from "../utils/authEvents";
import { storage } from "../utils/storage";

// --- Types ---
type User = {
	id: string;
	name: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
};

type AuthProviderProps = {
	children: ReactNode;
};

// --- Context ---

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	// On mount, check SecureStore/LocalStore for an existing session
	useEffect(() => {
		async function loadSession() {
			try {
				const [token, storedUser] = await Promise.all([
					storage.getItem(TOKEN_KEY),
					storage.getItem(USER_KEY),
				]);

				if (token && storedUser) {
					setUser(JSON.parse(storedUser) as User);
					setIsAuthenticated(true);
				}
			} catch (err) {
				console.error("Failed to load auth session:", err);
			} finally {
				setIsLoading(false);
			}
		}

		loadSession();
	}, []);

	async function persistSession(
		token: string,
		sessionUser: User,
	): Promise<void> {
		await storage.setItem(TOKEN_KEY, token);
		await storage.setItem(USER_KEY, JSON.stringify(sessionUser));
	}

	async function login(email: string, password: string): Promise<void> {
		const response = await fetch(`${API_PREFIX}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Invalid email or password");
		}

		const { token, user: loggedInUser }: { token: string; user: User } =
			await response.json();

		await persistSession(token, loggedInUser);
		setUser(loggedInUser);
		setIsAuthenticated(true);
	}

	async function register(
		email: string,
		password: string,
		name: string,
	): Promise<void> {
		const response = await fetch(`${API_PREFIX}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
		});

		if (!response.ok) {
			throw new Error("Registration failed");
		}

		const { token, user: newUser }: { token: string; user: User } =
			await response.json();

		await persistSession(token, newUser);
		setUser(newUser);
		setIsAuthenticated(true);
	}

	async function logout(): Promise<void> {
		await storage.deleteItem(TOKEN_KEY);
		await storage.deleteItem(USER_KEY);
		setUser(null);
		setIsAuthenticated(false);
	}

	// Lets apiFetch (a plain function, not a hook) trigger a logout on a
	// 401 without importing AuthContext itself and creating a require cycle.
	useEffect(() => {
		registerLogoutHandler(logout);
	});

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook ---
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
