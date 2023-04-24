import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import RecipeCard from "./RecipeCardMedium";

const RecipeCardMediumList = ({ recipes }) => {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
			{recipes.map((recipe, index) => (
				<View key={index} style={styles.cardWrapper}>
					<RecipeCard recipe={recipe} />
				</View>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
	},
	cardWrapper: {
		width: Math.max(250, Dimensions.get("window").width * 0.6),
		height: Math.max(190, Dimensions.get("window").height * 0.3),
		paddingHorizontal: 8,
		marginRight: 40,
	},
});

export default RecipeCardMediumList;
