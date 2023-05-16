import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "../components/authorizedComponents/addProduct/AddProduct";
import AddNewProduct from "../components/authorizedComponents/addNewProduct/AddNewProduct";

const AddProductStack = createStackNavigator();

const AddProductStackNavigator = () => {
	return (
		<AddProductStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<AddProductStack.Screen name="AddProduct" component={AddProduct} />
			<AddProductStack.Screen name="AddNewProduct" component={AddNewProduct} />
		</AddProductStack.Navigator>
	);
};

export default AddProductStackNavigator;
