import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import { Colors } from "react-native/Libraries/NewAppScreen";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f8f8",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
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
		fontWeight: "bold",
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
});

export default styles;
