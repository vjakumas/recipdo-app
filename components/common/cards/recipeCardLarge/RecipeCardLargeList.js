import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import RecipeCard from "./RecipeCardLarge";
import styles from "./recipeCardLargeList.style";

const RecipeCardLargeList = ({ recipes }) => {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
			{recipes.map((recipe, index) => (
				<View key={index} style={styles.cardWrapper}>
					<RecipeCard key={recipe.id} recipe={recipe} />
				</View>
			))}
		</ScrollView>
	);
};

export default RecipeCardLargeList;
