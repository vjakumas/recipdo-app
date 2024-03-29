import { AppRegistry } from "react-native";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import firebase from "./config/firebase/config";

import AppNavigator from "./navigation/AppNavigator";

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

	const logout = () => {
		firebase.auth().signOut();
	};

	useEffect(() => {
		const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing || !fontsLoaded) return null;

	return <AppNavigator user={user} onLogout={logout} />;
}

export default App;
