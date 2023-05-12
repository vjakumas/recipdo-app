import React from "react";
import { FlatList, View } from "react-native";
import RecipeCard from "./RecipeCardLarge";
import styles from "./recipeCardLargeList.style";

const RecipeCardLargeList = ({ recipes }) => {
	return (
		<FlatList
			data={recipes}
			renderItem={({ item: recipe }) => (
				<View style={styles.cardWrapper}>
					<RecipeCard recipe={recipe} />
				</View>
			)}
			keyExtractor={(recipe) => recipe.id.toString()}
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default RecipeCardLargeList;
