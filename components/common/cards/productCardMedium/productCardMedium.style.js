import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, SIZES } from "../../../../constants";

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		overflow: "hidden",
		backgroundColor: COLORS.white,
		marginBottom: SIZES.medium,
		marginRight: SIZES.xSmall,
		width: Dimensions.get("window").width * 0.4,
	},
	gradient: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 150,
	},
	textOverlay: {
		position: "absolute",
		bottom: SIZES.medium,
		left: SIZES.medium,
		zIndex: 10,
	},
	overlayText: {
		color: COLORS.white,
		fontSize: SIZES.medium,
		fontFamily: FONT.semiBold,
	},
	image: {
		width: "100%",
		height: 150,
		resizeMode: "cover",
	},
	infoBar: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "flex-start",
		backgroundColor: COLORS.darkGray,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		paddingHorizontal: SIZES.medium,
		paddingVertical: SIZES.small,
	},
	productName: {
		fontSize: SIZES.medium,
		fontFamily: FONT.semiBold,
		color: "white",
		marginBottom: SIZES.small,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: SIZES.xSmall,
	},
	infoText: {
		marginLeft: SIZES.small,
		fontFamily: FONT.medium,
		color: COLORS.lightGray,
	},
});

export default styles;
