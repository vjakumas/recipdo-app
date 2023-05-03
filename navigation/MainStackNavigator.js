import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../components/home/Home";
import SettingsScreen from "../components/settings/Settings";
import StatisticsScreen from "../components/statistics/Statistic";
import RecipeDetails from "../components/recipeDetails/RecipeDetails";
import PantryDetails from "../components/pantryDetails/PantryDetails";

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<MainStack.Screen name="Home" component={Home} />
			<MainStack.Screen name="Settings" component={SettingsScreen} />
			<MainStack.Screen name="Statistics" component={StatisticsScreen} />
			<MainStack.Screen name="RecipeDetails" component={RecipeDetails} />
			<MainStack.Screen name="PantryDetails" component={PantryDetails} />
		</MainStack.Navigator>
	);
};

export default MainStackNavigator;
