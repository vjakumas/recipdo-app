import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/login/Login";
import Register from "../components/register/Register";

const Stack = createStackNavigator();

const AuthNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Register" component={Register} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
