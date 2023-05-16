import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../../constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
		paddingHorizontal: SIZES.medium,
		paddingTop: SIZES.medium,
		justifyContent: "space-between",
	},
	bottomContainer: {
		marginBottom: 40,
	},
	contentContainer: {
		marginTop: 40,
		alignItems: "center",
	},
	logo: {
		width: 250,
		height: 250,
		resizeMode: "contain",
	},
	buttonContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginLeft: 8,
	},
	mainHeader: {
		fontFamily: FONT.bold,
		fontSize: SIZES.xLarge,
		color: COLORS.darkGray,
		marginTop: 20,
	},
	subText: {
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		color: COLORS.gray,
		textAlign: "center",
		marginTop: 10,
	},
	primaryButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.darkGray,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		...SHADOWS.xLarge,
	},
	primaryButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	separatorContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: SIZES.large,
		marginBottom: SIZES.medium,
	},
	line: {
		height: 1,
		backgroundColor: COLORS.lightGray,
		flex: 1,
		marginLeft: SIZES.small,
		marginRight: SIZES.small,
	},
	separatorText: {
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		color: COLORS.gray,
	},
	secondaryButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.white,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		...SHADOWS.xLarge,
	},
	secondaryButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.darkGray,
	},
});

export default styles;
