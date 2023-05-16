/* eslint-disable react/no-unescaped-entities */
import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "./start.style";

const Start = () => {
	const navigation = useNavigation();

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={{ height: "40%", width: "100%" }}>
				<Image style={styles.topImage} source={require("../../assets/images/start-top.png")} />
			</View>
			<View style={styles.mainContainer}>
				<View style={styles.container}>
					<Image style={styles.logoImage} source={require("../../assets/images/logo-black-green.png")} />
					<Text style={styles.headerTitle}>Delicious recipes for every taste, </Text>
					<Text style={styles.headerTitle}>let's begin!</Text>
				</View>
				<View style={styles.bottomButtons}>
					<TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.signInButton}>
						<Text style={styles.signInButtonText}>Sign in</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.signUpButton}>
						<Text style={styles.signUpButtonText}>Sign up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default Start;
