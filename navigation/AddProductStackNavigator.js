import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "../components/addProduct/AddProduct";
import AddNewProduct from "../components/addNewProduct/AddNewProduct";
import AddNewProductBarcode from "../components/addNewProductBarcode/AddNewProductBarcode";

const AddProductStack = createStackNavigator();

const AddProductStackNavigator = () => {
	return (
		<AddProductStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<AddProductStack.Screen name="AddProduct" component={AddProduct} />
			<AddProductStack.Screen name="AddNewProduct" component={AddNewProduct} />
			<AddProductStack.Screen name="AddNewProductBarcode" component={AddNewProductBarcode} />
		</AddProductStack.Navigator>
	);
};

export default AddProductStackNavigator;
