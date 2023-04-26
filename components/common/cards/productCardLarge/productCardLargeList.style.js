import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../../constants";

const styles = StyleSheet.create({
	productList: {
		paddingBottom: 20,
		alignItems: "center", // Add this line to center the product grid
	},
	productGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "100%",
		maxWidth: 600,
		paddingHorizontal: SIZES.medium, // Add this line to add space from the edge of the screen
	},
	card: {
		marginBottom: 20,
		width: "48%",
	},
});

export default styles;
