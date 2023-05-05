import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { COLORS, icons, images, SIZES } from "../../constants";
import styles from "./register.style";

import firebase from "../../config/firebase/config";
import { Touchable } from "react-native";
import Login from "../login/Login";

const Register = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");

	registerUser = async (email, password, name) => {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(() => {
				firebase
					.auth()
					.currentUser.sendEmailVerification({
						handleCodeInApp: true,
						url: "https://recipdo-710f8.firebaseapp.com",
					})
					.then(() => {
						alert("Email sent");
					})
					.catch((error) => {
						alert(error.message);
					})
					.then(() => {
						const today = new Date();
						const yesterday = new Date(today);
						yesterday.setDate(today.getDate() - 1);
						firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
							productsLastCheckDate: yesterday,
							name,
							email,
							expiredProducts: 0,
							consumedProducts: 0,
							expiringProducts: 0,
							consumedProductsList: [],
							savedRecipes: [],
							finishedRecipes: [],
							pantryItems: [],
							recentSearchedRecipes: [],
						});
					})
					.catch((error) => {
						alert(error.message);
					})
					.then(() => {
						navigation.reset({ index: 0, routes: [{ name: "Login" }] });
					});
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={{ flex: 1 }}>
				<ImageBackground source={images.topBackground} style={styles.topImage}>
					<View style={styles.mainContainer}>
						<View style={styles.container}>
							<Text style={styles.headerTitle}>Join us & cook with{"\n"}confidence</Text>
							<View style={styles.inputContainer}>
								<View style={styles.inputWrapper}>
									<TextInput
										style={styles.inputInput}
										onChangeText={(name) => setName(name)}
										placeholder="Name"
										format="text"
										placeholderTextColor="gray"
										autoCapitalize="none"
										autoCorrect={false}
										secureTextEntry={false}
									/>
								</View>
							</View>
							<View style={styles.inputContainer}>
								<View style={styles.inputWrapper}>
									<TextInput
										style={styles.inputInput}
										onChangeText={(email) => setEmail(email)}
										placeholder="Email"
										format="email"
										placeholderTextColor="gray"
										autoCapitalize="none"
										autoCorrect={false}
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
										secureTextEntry={true}
									/>
								</View>
							</View>
							<View style={styles.inputContainer}>
								<View style={styles.inputWrapper}>
									<TextInput
										style={styles.inputInput}
										onChangeText={(confirmPassoword) => setConfirmPassword(confirmPassoword)}
										placeholder="Confirm password"
										placeholderTextColor="gray"
										autoCapitalize="none"
										autoCorrect={false}
										secureTextEntry={true}
									/>
								</View>
							</View>
							<TouchableOpacity onPress={() => registerUser(email, password, name)} style={styles.submitButton}>
								<Text style={styles.submitButtonText}>Sign up</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.registerButton}>
								<Text style={{ fontWeight: "bold", fontSize: 16 }}>
									Already have an account? <Text style={{ color: COLORS.primary }}>Sign in</Text>
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default Register;
