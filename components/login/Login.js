import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../config/firebase/config";
import { COLORS, icons, images, SIZES } from "../../constants";
import styles from "./login.style";
import { Touchable } from "react-native";

const Login = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	loginUser = async (email, password) => {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			navigation.navigate("Dashboard");
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Welcome back!{"\n"}You have been missed!</Text>
			<View style={styles.inputContainer}>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.inputInput}
						onChangeText={(email) => setEmail(email)}
						placeholder="Email"
						placeholderTextColor="gray"
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={true}
					/>
				</View>
			</View>
			<View style={styles.inputContainer}>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.inputInput}
						onChangeText={(password) => setPassword(password)}
						placeholder="Password"
						placeholderTextColor="gray"
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={true}
					/>
				</View>
			</View>
			{/* <TextInput
					style={styles.textInput}
					placeholder="Email"
					onChangeText={(email) => setEmail(email)}
					autoCapitalize="none"
					format="email"
					autoCorrect={false}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="Password"
					onChangeText={(password) => setPassword(password)}
					autoCapitalize="none"
					autoCorrect={false}
					secureTextEntry={true}
				/> */}
			<TouchableOpacity onPress={() => loginUser(email, password)} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>Sign in</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerButton}>
				<Text style={{ fontWeight: "bold", fontSize: 16 }}>Dont have an account? Register now</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Login;
