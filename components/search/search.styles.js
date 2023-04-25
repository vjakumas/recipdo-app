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
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: SIZES.medium,
		marginTop: SIZES.medium,
		backgroundColor: COLORS.white,
		borderRadius: 15,
		borderColor: COLORS.lightGray,
		borderWidth: 1,
		height: 50,
		marginBottom: SIZES.small,
		marginLeft: 10,
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		marginLeft: 40,
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		height: "100%",
	},
	searchIconContainer: {
		position: "absolute",
		left: SIZES.medium + 10,
		zIndex: 10,
	},
	buttonsContainer: {
		flexDirection: "row",
		width: "100%",
		paddingHorizontal: 10,
	},
	searchTypeButton: {
		flex: 1,
		padding: SIZES.small,
		borderRadius: 10,
		backgroundColor: COLORS.white,
		borderColor: COLORS.primary,
		borderWidth: 1,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonMargin: {
		marginRight: 10,
	},
	searchTypeButtonSelected: {
		backgroundColor: COLORS.primary,
	},
	searchTypeText: {
		color: COLORS.primary,
		fontFamily: FONT.semiBold,
		fontSize: SIZES.medium,
	},
	searchTypeTextSelected: {
		color: COLORS.white,
		fontWeight: "bold",
	},
	searchResultsHeading: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: SIZES.small,
		marginBottom: 10,
		marginTop: 10,
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
});

export default styles;
