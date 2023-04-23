import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Start from "../components/start/Start";

const Stack = createStackNavigator();

const AuthNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="Start"
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="Start" component={Start} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Register" component={Register} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
