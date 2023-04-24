import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES, SHADOWS } from "../../../../constants";

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		overflow: "hidden",
		width: "120%",
	},
	image: {
		height: 180,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
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
	gradient: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 180,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
});

export default styles;
