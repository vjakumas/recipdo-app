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
		marginBottom: 16,
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
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
		marginBottom: 8,
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
		marginBottom: 8,
	},
	instructionBulletContainer: {
		backgroundColor: COLORS.secondary,
		borderRadius: 50,
		paddingHorizontal: 15,
		paddingVertical: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	instructionBullet: {
		fontSize: 16,
		fontWeight: "bold",
		color: COLORS.primary,
	},
	instructionText: {
		fontSize: 16,
		fontFamily: FONT.regular,
		flex: 1,
		flexWrap: "wrap",
		alignContent: "flex-end",
	},
});

export default styles;
