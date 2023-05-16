import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT, SHADOWS } from "../../../constants";

const styles = StyleSheet.create({
	container: {
		marginHorizontal: SIZES.xSmall,
		flex: 1,
		backgroundColor: COLORS.white,
		paddingHorizontal: SIZES.medium,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 5,
	},
	logo: {
		width: "41%",
		height: 40,
		resizeMode: "contain",
	},
	profileImageContainer: {
		alignItems: "center",
		marginTop: SIZES.medium,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: COLORS.lightGray,
	},
	editProfileImageButton: {
		position: "absolute",
		bottom: 5,
		right: 5,
		backgroundColor: COLORS.white,
		borderRadius: 50,
		padding: 5,
	},
	title: {
		fontFamily: FONT.semiBold,
		fontSize: SIZES.large,
		color: COLORS.darkGray,
		marginTop: SIZES.medium,
		marginBottom: SIZES.medium,
	},
	label: {
		fontFamily: FONT.semiBold,
		marginTop: SIZES.medium,
		marginLeft: SIZES.small,
		fontSize: 16,
		color: COLORS.darkGray,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: SIZES.medium,
		marginTop: 10,
		backgroundColor: COLORS.white,
		borderRadius: 15,
		borderColor: COLORS.lightGray,
		borderWidth: 1,
		height: 50,
		marginBottom: SIZES.small,
		marginLeft: 10,
		marginRight: 10,
	},
	input: {
		flex: 1,
		marginLeft: SIZES.xSmall,
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		height: "100%",
	},
	updateButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 15,
		paddingVertical: SIZES.small,
		paddingHorizontal: SIZES.medium,
		alignItems: "center",
		marginTop: SIZES.large,
	},
	updateButtonText: {
		fontFamily: FONT.semiBold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	primaryButton: {
		marginLeft: 10,
		width: "95%",
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
	buttonContent: {
		flexDirection: "row",
		alignItems: "center",
	},
});

export default styles;
