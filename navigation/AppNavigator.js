import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Dashboard from "../components/dashboard/Dashboard";
import AuthNavigator from "./AuthNavigator";

const Stack = createStackNavigator();

const AppNavigator = ({ user, onLogout }) => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={user ? "Dashboard" : "Auth"}
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name="Auth" component={AuthNavigator} />
				<Stack.Screen name="Dashboard">{(props) => <Dashboard {...props} onLogout={onLogout} />}</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
