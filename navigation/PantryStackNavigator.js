import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PantryList from "../components/pantryList/PantryList";
import PantryDetails from "../components/pantryDetails/PantryDetails";
import EditProduct from "../components/editProduct/EditProduct";
import SearchScreen from "../components/search/Search";

const PantryStack = createStackNavigator();

const PantryStackNavigator = () => {
	return (
		<PantryStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<PantryStack.Screen name="PantryList" component={PantryList} />
			<PantryStack.Screen name="PantryDetails" component={PantryDetails} />
			<PantryStack.Screen name="EditProduct" component={EditProduct} />
			<PantryStack.Screen name="SearchScreen" component={SearchScreen} />
		</PantryStack.Navigator>
	);
};

export default PantryStackNavigator;
