import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	logo: {
		width: 100,
		height: 40,
		resizeMode: "contain",
	},
	rightIcons: {
		flexDirection: "row",
		alignItems: "center",
	},
	profilePicture: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginLeft: 16,
	},
	recipesContainer: {
		flex: 1,
		marginTop: 20,
	},
	notificationIcon: {
		marginRight: 15,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "bold",
	},
	logoutButton: {
		backgroundColor: "#FF6347",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	logoutText: {
		color: "#fff",
		fontWeight: "bold",
	},
	categorySection: {
		marginBottom: -20,
		marginTop: 0,
	},
	categoryTitle: {
		fontSize: 20,
		fontFamily: FONT.semiBold,
		marginLeft: 0,
		marginBottom: 8,
	},
	categoryHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	categorySectionSaveTheFood: {
		marginBottom: -20,
		marginTop: 0,
	},
	categoryTitleSaveTheFood: {
		fontSize: 20,
		fontFamily: FONT.bold,
		color: COLORS.primary,
		marginLeft: 0,
		marginBottom: 8,
	},
	categoryHeaderSaveTheFood: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	seeAllButton: {
		backgroundColor: "#CEEEDA",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginBottom: 10,
	},
	seeAllText: {
		color: COLORS.primary,
		fontWeight: "bold",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noRecipeText: {
		marginLeft: 16,
		fontFamily: FONT.semiBold,
		fontSize: SIZES.medium,
		color: COLORS.darkGray,
	},
	noRecipeSubText: {
		marginBottom: "10%",
		marginLeft: 16,
		marginRight: 16,
		fontFamily: FONT.semiBold,
		color: COLORS.gray,
	},
});

export default styles;
