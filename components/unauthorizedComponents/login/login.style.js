import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../../../constants";

const styles = StyleSheet.create({
	topImage: {
		flex: 1,
		width: "100%",
		height: "20%",
	},
	mainContainer: {
		borderRadius: 30,
		height: "100%",
		marginTop: 150,
		backgroundColor: COLORS.white,
	},
	container: {
		marginHorizontal: SIZES.xLarge,
		marginTop: 50,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: SIZES.small,
	},
	headerTitle: {
		fontSize: SIZES.xLarge,
		fontFamily: FONT.bold,
		color: COLORS.darkGray,
		textAlign: "center",
		marginBottom: SIZES.medium,
	},
	headerBtn: {
		fontSize: SIZES.medium,
		fontFamily: FONT.medium,
		color: COLORS.gray,
	},
	cardsContainer: {
		marginTop: SIZES.medium,
		gap: SIZES.small,
	},
	inputContainer: {
		marginTop: SIZES.xLarge,
		height: 60,
		width: "100%",
	},
	inputWrapper: {
		flex: 1,
		backgroundColor: COLORS.white,
		marginRight: SIZES.small,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: SIZES.medium,
		borderColor: COLORS.lightGray,
		height: "100%",
		width: "100%",
		borderWidth: 1,
	},
	inputInput: {
		fontFamily: FONT.regular,
		width: "100%",
		height: "100%",
		paddingHorizontal: SIZES.medium,
	},
	submitButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.darkGray,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 50,
		...SHADOWS.xLarge,
	},
	submitButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	registerButton: {
		alignItems: "center",
		marginTop: SIZES.large,
	},
});

export default styles;
