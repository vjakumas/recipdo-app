import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRegistry, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "./config/firebase/config";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Header from "./components/Header";

const Stack = createStackNavigator();

function App() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();

	AppRegistry.registerComponent("X", () => App);

	// if (Platform.OS === "web") {
	// 	const rootTag = document.getElementById("root") || document.getElementById("X");
	// 	AppRegistry.runApplication("X", { rootTag });
	// }

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing) return null;

	if (!user) {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{
						headerTitle: () => <Header name="Login" />,
						headerStyle: {
							heigth: 150,
							borderBottomLeftRadius: 50,
							borderBottomRightRadius: 50,
							backgroundColor: "#00e4d0",
							shadowColor: "#000",
							elevation: 25,
						},
					}}
				/>
				<Stack.Screen
					name="Register"
					component={Register}
					options={{
						headerTitle: () => <Header name="Register" />,
						headerStyle: {
							heigth: 150,
							borderBottomLeftRadius: 50,
							borderBottomRightRadius: 50,
							backgroundColor: "#00e4d0",
							shadowColor: "#000",
							elevation: 25,
						},
					}}
				/>
			</Stack.Navigator>
		);
	}

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					headerTitle: () => <Header name="Dashboard" />,
					headerStyle: {
						heigth: 150,
						borderBottomLeftRadius: 50,
						borderBottomRightRadius: 50,
						backgroundColor: "#00e4d0",
						shadowColor: "#000",
						elevation: 25,
					},
				}}
			/>
		</Stack.Navigator>
	);
}

export default () => {
	return (
		<NavigationContainer>
			<App />
		</NavigationContainer>
	);
};
