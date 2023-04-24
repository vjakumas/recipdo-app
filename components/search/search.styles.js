import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 30,
	},
	logo: {
		width: "70%",
		height: 60,
	},
	searchBarContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: SIZES.medium,
	},
	searchInput: {
		flex: 1,
		borderColor: COLORS.gray,
		borderWidth: 1,
		borderRadius: SIZES.small,
		paddingHorizontal: SIZES.small,
		marginRight: SIZES.small,
	},
	searchTypeContainer: {
		flexDirection: "row",
	},
	searchTypeButton: {
		paddingHorizontal: SIZES.small,
		paddingVertical: SIZES.xSmall,
		borderRadius: SIZES.small,
		backgroundColor: COLORS.lightGray,
		marginLeft: SIZES.xSmall,
	},
	searchTypeButtonSelected: {
		backgroundColor: COLORS.primary,
	},
	searchTypeText: {
		fontFamily: FONT.semiBold,
		fontSize: SIZES.small,
		color: COLORS.darkGray,
	},
	searchTypeTextSelected: {
		color: COLORS.white,
	},
	recipeCard: {
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: SIZES.medium,
		backgroundColor: COLORS.white,
		marginHorizontal: SIZES.medium,
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
	infoText: {
		marginLeft: 5,
		color: "white",
	},
});

export default styles;
