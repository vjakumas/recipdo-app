import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";

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
		marginBottom: 15,
		elevation: 3, // For Android
		shadowColor: COLORS.black, // For iOS
		shadowOffset: { width: 0, height: 2 }, // For iOS
		shadowOpacity: 0.1, // For iOS
		shadowRadius: 2, // For iOS
	},
	topThreeContainer: {
		width: "100%",
	},
	topThreeIndex: {
		fontSize: 18,
		fontFamily: FONT.bold,
		marginRight: 10,
	},
	topThreeName: {
		fontSize: 16,
		fontFamily: FONT.regular,
		marginRight: 10,
	},
	topThreeItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginLeft: 10,
		marginBottom: 8,
	},
	topThreeLabel: {
		fontSize: 18,
		fontFamily: FONT.medium,
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
		marginBottom: 10,
	},
	statisticLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statisticCardContent: {
		fontFamily: FONT.bold,
		marginLeft: 15,
		justifyContent: "center",
	},
	label: {
		marginLeft: 10,
		fontSize: SIZES.medium,
		fontFamily: FONT.regular,
	},
	value: {
		fontSize: 20,
		fontFamily: FONT.semiBold,
		color: COLORS.green,
	},
	valueTop3: {
		textAlign: "center",
		marginRight: 8,
		fontSize: 20,
		fontFamily: FONT.semiBold,
		color: COLORS.darkGray,
	},
	pieChartContainer: {
		marginBottom: 20,
	},
});

export default styles;
