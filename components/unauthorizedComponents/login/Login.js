/* eslint-disable react/no-unescaped-entities */
import { View, Text, TouchableOpacity, TextInput, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../../config/firebase/config";
import { COLORS, images } from "../../../constants";
import styles from "./login.style";

const Login = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const loginUser = async (email, password) => {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			navigation.reset({ index: 0, routes: [{ name: "MainApp", state: { routes: [{ name: "Home" }] } }] });
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={{ flex: 1 }}>
				<ImageBackground source={images.topBackground} style={styles.topImage}>
					<View style={styles.mainContainer}>
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
										inputType="email"
										secureTextEntry={false}
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
										inputType="password"
										secureTextEntry={true}
									/>
								</View>
							</View>
							<TouchableOpacity onPress={() => loginUser(email, password)} style={styles.submitButton}>
								<Text style={styles.submitButtonText}>Sign in</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerButton}>
								<Text style={{ fontWeight: "bold", fontSize: 16 }}>
									Don't have an account? <Text style={{ color: COLORS.primary }}>Sign up</Text>
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default Login;
