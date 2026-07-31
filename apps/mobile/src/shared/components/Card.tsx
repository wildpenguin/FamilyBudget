import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, spacing } from "../theme";

export function Card({ style, ...props }: ViewProps) {
	return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		padding: spacing.md,
	},
});
