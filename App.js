import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRegistry } from "react-native";
import { useFonts } from "expo-font";
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

	const [fontsLoaded] = useFonts({
		PoppinsBlack: require("./assets/fonts/Poppins-Black.ttf"),
		PoppinsBlackItalic: require("./assets/fonts/Poppins-BlackItalic.ttf"),
		PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
		PoppinsBoldItalic: require("./assets/fonts/Poppins-BoldItalic.ttf"),
		PoppinsExtraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
		PoppinsExtraBoldItalic: require("./assets/fonts/Poppins-ExtraBoldItalic.ttf"),
		PoppinsExtraLight: require("./assets/fonts/Poppins-ExtraLight.ttf"),
		PoppinsExtraLightItalic: require("./assets/fonts/Poppins-ExtraLightItalic.ttf"),
		PoppinsItalic: require("./assets/fonts/Poppins-Italic.ttf"),
		PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
		PoppinsLightItalic: require("./assets/fonts/Poppins-LightItalic.ttf"),
		PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
		PoppinsMediumItalic: require("./assets/fonts/Poppins-MediumItalic.ttf"),
		PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
		PoppinsSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
		PoppinsSemiBoldItalic: require("./assets/fonts/Poppins-SemiBoldItalic.ttf"),
		PoppinsThin: require("./assets/fonts/Poppins-Thin.ttf"),
		PoppinsThinItalic: require("./assets/fonts/Poppins-ThinItalic.ttf"),
	});

	AppRegistry.registerComponent("X", () => App);

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing || !fontsLoaded) return null;

	if (!user) {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Register"
					component={Register}
					options={{
						headerTitle: () => <Header name="Register" />,
						headerStyle: { backgroundColor: "#000" },
					}}
				/>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{
						headerTitle: () => <Header name="Login" />,
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
