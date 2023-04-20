import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

import firebase from "../../config/firebase/config";
import { Touchable } from "react-native";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

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
			</View>
			<TouchableOpacity onPress={() => registerUser(email, password, firstName, lastName)} style={styles.button}>
				<Text style={{ fontWeight: "bold", fontSize: 16 }}>Register</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 100,
	},
	textInput: {
		paddingTop: 20,
		paddingBottom: 10,
		width: 400,
		fontSize: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginBottom: 100,
		textAlign: "center",
	},
	button: {
		marginTop: 50,
		heaight: 70,
		width: 250,
		backgroundColor: "#026efd",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
	},
});
