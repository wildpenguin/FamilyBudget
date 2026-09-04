// Lets non-React modules (e.g. apiFetch) trigger a logout without
// importing AuthContext directly — avoids a require cycle, since
// AuthContext itself depends on apiConfig for API_PREFIX.
type LogoutHandler = () => Promise<void> | void;

let logoutHandler: LogoutHandler | null = null;

export function registerLogoutHandler(handler: LogoutHandler): void {
	logoutHandler = handler;
}

export function triggerLogout(): void {
	logoutHandler?.();
}
