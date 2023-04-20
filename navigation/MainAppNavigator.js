import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Dashboard from "../components/dashboard/Dashboard";

const Stack = createStackNavigator();

const MainAppNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false, // Hide the header, you can customize this to your needs
			}}>
			<Stack.Screen name="Dashboard" component={Dashboard} />
			{/* Add other main app screens here */}
		</Stack.Navigator>
	);
};

export default MainAppNavigator;
