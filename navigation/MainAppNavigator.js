import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/index";

import MainStackNavigator from "./MainStackNavigator";
import AddProductStackNavigator from "./AddProductStackNavigator";
import PantryStackNavigator from "./PantryStackNavigator";
import SavedRecipesStackNavigator from "./SavedRecipesStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";

const Tab = createBottomTabNavigator();

const MainAppNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Main") {
						iconName = focused ? "ios-home" : "ios-home-outline";
					} else if (route.name === "Search") {
						iconName = focused ? "ios-search" : "ios-search-outline";
					} else if (route.name === "Add Product") {
						iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
					} else if (route.name === "Pantry List") {
						iconName = focused ? "ios-list" : "ios-list-outline";
					} else if (route.name === "Saved") {
						iconName = focused ? "ios-heart" : "ios-heart-outline";
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: "gray",
				headerShown: false,
				tabBarLabel: () => null,
				tabBarStyle: [
					{
						display: "flex",
					},
					null,
				],
			})}>
			<Tab.Screen name="Main" component={MainStackNavigator} />
			<Tab.Screen name="Search" component={SearchStackNavigator} />
			<Tab.Screen name="Add Product" component={AddProductStackNavigator} />
			<Tab.Screen name="Pantry List" component={PantryStackNavigator} />
			<Tab.Screen name="Saved" component={SavedRecipesStackNavigator} />
		</Tab.Navigator>
	);
};

export default MainAppNavigator;
