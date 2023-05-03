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
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.black,
		marginLeft: 16,
		marginTop: 20,
		marginBottom: 10,
	},
	productList: {
		flexGrow: 1,
	},
	noProductsContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noProductsTitle: {
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		color: COLORS.gray,
		textAlign: "center",
		marginTop: SIZES.small,
	},
	noProductsHeader: {
		fontFamily: FONT.bold,
		fontSize: SIZES.large,
		color: COLORS.gray,
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
});

export default styles;
