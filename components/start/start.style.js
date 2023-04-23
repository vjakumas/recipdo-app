import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";

const styles = StyleSheet.create({
	topImage: {
		resizeMode: "contain",
		width: "100%",
		height: "100%",
		marginTop: "-7%",
	},
	logoImage: {
		resizeMode: "contain",
		width: "100%",
		height: 55,
		alignSelf: "center",
		marginBottom: 20,
	},
	mainContainer: {
		flex: 1,
		borderRadius: 30,
		backgroundColor: COLORS.white,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		marginHorizontal: SIZES.xLarge,
	},
	bottomButtons: {
		marginBottom: 100,
		marginHorizontal: SIZES.xLarge,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: SIZES.large,
		fontFamily: FONT.medium,
		color: COLORS.darkGray,
		textAlign: "center",
		marginBottom: SIZES.medium,
	},
	headerBtn: {
		fontSize: SIZES.medium,
		fontFamily: FONT.medium,
		color: COLORS.gray,
	},
	signInButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.darkGray,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		...SHADOWS.xLarge,
	},
	signInButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	signUpButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.white,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		...SHADOWS.xLarge,
	},
	signUpButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.darkGray,
	},
});

export default styles;
