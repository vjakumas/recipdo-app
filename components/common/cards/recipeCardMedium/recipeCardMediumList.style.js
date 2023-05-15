import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
	},
	cardWrapper: {
		width: Math.max(250, Dimensions.get("window").width * 0.6),
		height: Math.max(190, Dimensions.get("window").height * 0.3),
		paddingHorizontal: 8,
	},
});

export default styles;
