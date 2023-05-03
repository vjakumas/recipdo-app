import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
		marginBottom: 16,
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		flex: 1, // Add this line
		fontSize: 24,
		fontWeight: "bold",
		marginRight: 8, // Add some margin to the right
		flexWrap: "wrap", // Add this line
	},
	saveRecipeButton: {
		paddingLeft: 8,
	},
	dishTypeContainer: {
		position: "absolute",
		left: 0,
		bottom: 0,
		backgroundColor: COLORS.primary,
		paddingHorizontal: 12,
		margin: 10,
		paddingVertical: 6,
		borderRadius: 10,
	},
	dishType: {
		color: "white",
		fontFamily: FONT.medium,
		fontSize: 16,
	},
	readyInMinutesContainer: {
		position: "absolute",
		right: 0,
		bottom: 0,
		backgroundColor: COLORS.gray,
		paddingHorizontal: 12,
		margin: 10,
		paddingVertical: 6,
		borderRadius: 10,
	},
	readyInMinutes: {
		color: "white",
		fontFamily: FONT.medium,
		fontSize: 16,
	},
	text: {
		fontSize: 16,
		marginLeft: 10,
	},
	nutritionContainer: {
		marginTop: 16,
		marginBottom: 16,
	},
	nutritionTitle: {
		fontSize: 20,
		fontWeight: "bold",
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
	nutritionText: {
		fontSize: 16,
		fontFamily: FONT.bold,
		marginTop: 10,
		marginLeft: 10,
		color: COLORS.secondary,
	},
	nutritionIcon: {
		backgroundColor: COLORS.lightGray,
		padding: 10,
		borderRadius: 10,
		color: COLORS.warning,
	},
	ingredientsContainer: {
		marginBottom: 16,
	},
	ingredientsTitle: {
		marginTop: 15,
		fontSize: 20,
		fontFamily: FONT.bold,
		marginBottom: 15,
	},
	ingredientRow: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		marginBottom: SIZES.xSmall,
	},
	boldText: {
		fontWeight: "bold",
	},
	ingredientIcon: {
		marginRight: SIZES.margin,
	},
	instructionsTitle: {
		marginTop: 15,
		fontSize: 20,
		fontFamily: FONT.bold,
		marginBottom: 15,
	},
	strikethroughText: {
		textDecorationLine: "line-through",
	},
	instructionsTitleContainer: {
		marginBottom: 8,
	},
	instructionsContainer: {
		marginBottom: 16,
	},
	instructionStep: {
		flexDirection: "row",
		borderColor: COLORS.lightGray,
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 8,
	},
	instructionBulletContainer: {
		backgroundColor: COLORS.lightGray,
		borderTopLeftRadius: 4,
		borderBottomLeftRadius: 4,
		paddingHorizontal: 15,
		paddingVertical: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	instructionBulletContainerSelected: {
		backgroundColor: COLORS.primary,
		borderTopLeftRadius: 4,
		borderBottomLeftRadius: 4,
		paddingHorizontal: 15,
		paddingVertical: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	instructionBullet: {
		fontSize: 16,
		fontWeight: "bold",
		color: COLORS.darkGray,
	},
	instructionText: {
		fontSize: 16,
		fontFamily: FONT.regular,
		flex: 1,
		flexWrap: "wrap",
		alignSelf: "center",
		textAlignVertical: "center",
	},
	instructionStepSelected: {
		backgroundColor: COLORS.primary,
	},
	instructionTextSelected: {
		fontSize: 16,
		fontFamily: FONT.regular,
		flex: 1,
		flexWrap: "wrap",
		alignContent: "flex-end",
		color: "white",
		textDecorationLine: "line-through",
	},
	instructionCheck: {
		fontSize: 25,
		color: "white",
	},
	submitButton: {
		width: "100%",
		height: 65,
		backgroundColor: COLORS.darkGray,
		borderRadius: SIZES.medium,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 25,
		...SHADOWS.xLarge,
	},
	submitButtonText: {
		fontFamily: FONT.bold,
		fontSize: SIZES.medium,
		color: COLORS.white,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center", // Add this line
		alignItems: "center", // Add this line
	},
	modalContainer: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		width: "80%", // Add this line
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
