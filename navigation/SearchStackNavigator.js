import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import RecipeDetails from "../components/recipeDetails/RecipeDetails";
import Search from "../components/search/Search";

const SearchStack = createStackNavigator();

const SearchStackNavigator = () => {
	return (
		<SearchStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<SearchStack.Screen name="SearchScreen" component={Search} />
			<SearchStack.Screen name="RecipeDetails" component={RecipeDetails} />
		</SearchStack.Navigator>
	);
};

export default SearchStackNavigator;
