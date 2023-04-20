import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "./register.style";

import firebase from "../../config/firebase/config";
import { Touchable } from "react-native";

const Register = () => {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");

	registerUser = async (email, password, firstName, lastName) => {
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
						firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
							firstName,
							lastName,
							email,
						});
					})
					.catch((error) => {
						alert(error.message);
					});
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Join us & cook with!{"\n"}confidence!</Text>
			<View style={styles.inputContainer}>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.inputInput}
						onChangeText={(name) => setName(name)}
						placeholder="Name"
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
						onChangeText={(email) => setEmail(email)}
						placeholder="Email"
						format="email"
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

			{/* <View style={styles.container}>
			<Text style={{ fontWeight: "bold", fontSize: 26 }}>Register here</Text>
			<View style={{ marginTop: 40 }}>
				<TextInput
					style={styles.textInput}
					placeholder="First Name"
					onChangeText={(firstName) => setFirstName(firstName)}
					autoCorrect={false}
				/>
				<TextInput style={styles.textInput} placeholder="Last Name" onChangeText={(lastName) => setFirstName(lastName)} autoCorrect={false} />
				<TextInput
					style={styles.textInput}
					placeholder="Email"
					onChangeText={(email) => setFirstName(email)}
					autoCorrect={false}
					autoCapitalize="none"
					keyboardType="email-address"
				/>
				<TextInput
					style={styles.textInput}
					placeholder="Password"
					onChangeText={(password) => setFirstName(password)}
					autoCorrect={false}
					autoCapitalize="none"
					secureTextEntry={true}
				/>
			</View> */}
			<TouchableOpacity onPress={() => registerUser(email, password, firstName, lastName)} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.registerButton}>
				<Text style={{ fontWeight: "bold", fontSize: 16 }}>Already have an account? Sign in</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Register;
