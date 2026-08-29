import { MD3LightTheme, useTheme } from "react-native-paper";
import { colors } from "./colors";

export const theme = {
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
		income: colors.income,
		expense: colors.expense,
	},
};

// `MD3Colors` is a `type`, not an `interface`, so custom keys like
// `income`/`expense` can't be added via declaration merging — this typed
// wrapper is react-native-paper's recommended way to get real type safety
// on them instead of falling back to `useTheme()`'s plain `MD3Theme` type.
export type AppTheme = typeof theme;

export function useAppTheme(): AppTheme {
	return useTheme<AppTheme>();
}
