import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 5,
	},
	logo: {
		width: "50%",
		height: 40,
	},
	statisticsContainer: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	statisticItem: {
		flexDirection: "row",
		backgroundColor: COLORS.white,
		padding: 15,
		borderRadius: 10,
		marginBottom: 15,
		alignItems: "center",
		justifyContent: "space-between",
		elevation: 3, // For Android
		shadowColor: COLORS.black, // For iOS
		shadowOffset: { width: 0, height: 2 }, // For iOS
		shadowOpacity: 0.1, // For iOS
		shadowRadius: 2, // For iOS
	},
	topThreeItemContainer: {
		flexDirection: "column",
		alignItems: "left",
		justifyContent: "center",
		backgroundColor: COLORS.white,
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		elevation: 3, // For Android
		shadowColor: COLORS.black, // For iOS
		shadowOffset: { width: 0, height: 2 }, // For iOS
		shadowOpacity: 0.1, // For iOS
		shadowRadius: 2, // For iOS
	},
	topThreeContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
		width: "100%",
	},
	topThreeItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
		marginLeft: 8,
	},
	topThreeLabel: {
		fontSize: 18,
		fontWeight: "bold",
		marginRight: 10,
	},
	iconAndLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconAndLabelContainerTop3: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 8,
	},
	statisticLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statisticCardContent: {
		marginLeft: 15,
	},
	statisticCardContent: {
		fontFamily: FONT.bold,
		marginLeft: 15,
		backgroundColor: "green",
		justifyContent: "center",
	},
	label: {
		marginLeft: 10, // Add a margin to separate label from the icon
		fontSize: SIZES.medium,
		fontFamily: FONT.regular,
	},
	value: {
		fontSize: 20,
		fontFamily: FONT.semiBold,
		color: COLORS.green,
	},
	valueTop3: {
		fontSize: 20,
		fontFamily: FONT.semiBold,
		color: COLORS.primary,
	},
	pieChartContainer: {
		marginBottom: 20,
	},
});

export default styles;
