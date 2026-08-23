import { Redirect } from "expo-router";

// The "Add" tab press is intercepted in (tabs)/_layout.tsx to open the
// BottomSheet from AddSheetContext instead of navigating here. This route
// only exists so Tabs.Screen name="add" resolves; it's a safety net for
// anything that deep-links here directly (e.g. router.push('/(tabs)/add')).
export default function AddScreen() {
	return <Redirect href="/(tabs)" />;
}
