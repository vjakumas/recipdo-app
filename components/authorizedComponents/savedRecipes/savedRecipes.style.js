import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../../constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.white,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 5,
	},
	logo: {
		width: "39%",
		height: 40,
	},
	titleText: {
		fontSize: SIZES.large,
		fontWeight: "bold",
		color: COLORS.secondary,
		fontFamily: FONT.semiBold,
	},
	totalText: {
		fontSize: SIZES.large,
		color: COLORS.primary,
		fontFamily: FONT.semiBold,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	headerTitle: {
		fontSize: SIZES.large,
		fontFamily: FONT.semiBold,
		marginLeft: SIZES.medium,
		marginTop: 20,
		marginBottom: 20,
	},
	recipeCard: {
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: SIZES.medium,
		backgroundColor: COLORS.white,
		marginHorizontal: SIZES.small,
		...SHADOWS.recipeCard,
	},
	recipeImage: {
		height: 180,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 180,
		justifyContent: "flex-end",
		padding: 15,
	},
	recipeType: {
		backgroundColor: COLORS.primary,
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 1,
		fontSize: SIZES.medium,
		fontFamily: FONT.semiBold,
		marginBottom: SIZES.xSmall,
		color: "white",
		alignSelf: "flex-start",
		overflow: "hidden",
	},
	recipeName: {
		fontSize: SIZES.medium,
		fontFamily: FONT.semiBold,
		color: "white",
	},
	infoBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: COLORS.darkGray,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	greenDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "green",
		marginRight: 6,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	infoText: {
		marginLeft: 5,
		color: "white",
	},
	noRecipesContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noRecipesTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.gray,
	},
	noProductsContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noProductsHeader: {
		fontFamily: FONT.bold,
		fontSize: SIZES.large,
		color: COLORS.gray,
	},
	noProductsTitle: {
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		color: COLORS.gray,
		textAlign: "center",
		marginTop: SIZES.small,
	},
});

export default styles;
