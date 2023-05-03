import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		padding: 16,
	},
	image: {
		width: "100%",
		height: 200,
		resizeMode: "cover",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	unitHeader: {
		flexDirection: "row",
		justifyContent: "start",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		flex: 1,
		fontSize: 24,
		fontWeight: "bold",
		marginRight: 8,
		flexWrap: "wrap",
	},
	nutritionContainer: {
		marginTop: 16,
		marginBottom: 16,
	},
	nutritionTitle: {
		fontSize: 18,
		fontFamily: FONT.bold,
		color: COLORS.darkGray,
		marginBottom: 20,
	},
	nutritionRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 8,
	},
	nutritionItem: {
		flexDirection: "row",
		alignItems: "right",
		width: "30%",
	},
	nutritionIcon: {
		backgroundColor: COLORS.lightGray,
		padding: 10,
		borderRadius: 10,
		color: COLORS.darkGray,
	},
	nutritionText: {
		fontSize: 16,
		fontFamily: FONT.medium,
		marginTop: 10,
		marginLeft: 10,
		color: COLORS.darkGray,
	},
	boldText: {
		fontFamily: FONT.bold,
	},
	boldQuantity: {
		fontFamily: FONT.medium,
		color: COLORS.gray,
		fontSize: 18,
		marginRight: 5,
	},
	grayText: {
		fontSize: 18,
		color: COLORS.gray,
		fontFamily: FONT.medium,
	},
	unitHeader: {
		flexDirection: "row",
		justifyContent: "start",
		alignItems: "center",
		marginBottom: 16,
	},
	expirationDateContainer: {
		marginTop: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	calendarIcon: {
		marginRight: 5,
	},
	expirationDateTitle: {
		fontSize: 18,
		fontFamily: FONT.bold,
	},
	expirationDate: {
		fontSize: 18,
		fontFamily: FONT.medium,
		marginLeft: 25,
	},
	dateAndIcon: {
		flexDirection: "row",
		alignItems: "center",
	},
	buttonsContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		marginTop: 16,
	},
	findRecipesButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.darkGray,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		...SHADOWS.xLarge,
	},
	findRecipesButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	removeProductButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.white,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
		...SHADOWS.xLarge,
	},
	removeProductButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.darkGray,
	},
	imageContainer: {
		position: "relative",
	},
	image: {
		width: "100%",
		height: 200,
		resizeMode: "cover",
	},
	editButton: {
		position: "absolute",
		top: 10,
		right: 10,
		padding: 8,
		borderRadius: 10,
		backgroundColor: COLORS.white,
		...SHADOWS.medium,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		width: "80%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalText: {
		fontSize: 16,
		marginBottom: 20,
	},
	modalButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalCancelButton: {
		backgroundColor: "gray",
		padding: 10,
		borderRadius: 5,
	},
	modalConfirmButton: {
		backgroundColor: COLORS.primary,
		padding: 10,
		borderRadius: 5,
	},
	modalCancelButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	modalConfirmButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default styles;
