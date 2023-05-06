import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import RecipeDetails from "../components/recipeDetails/RecipeDetails";
import SavedRecipes from "../components/savedRecipes/SavedRecipes";

const SavedRecipesStack = createStackNavigator();

const SavedRecipesStackNavigator = () => {
	return (
		<SavedRecipesStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<SavedRecipesStack.Screen name="SavedRecipes" component={SavedRecipes} />
			<SavedRecipesStack.Screen name="RecipeDetails" component={RecipeDetails} />
		</SavedRecipesStack.Navigator>
	);
};

export default SavedRecipesStackNavigator;
