import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import MainAppNavigator from "./MainAppNavigator";

const Stack = createStackNavigator();

const AppNavigator = ({ user, onLogout }) => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={user ? "MainApp" : "Auth"}
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name="Auth" component={AuthNavigator} />
				<Stack.Screen name="MainApp">{(props) => <MainAppNavigator {...props} onLogout={onLogout} />}</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
