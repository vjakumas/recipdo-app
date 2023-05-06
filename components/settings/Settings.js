import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import Toast from "react-native-toast-message";
import styles from "./settings.style";
import firebase, { firestore } from "../../config/firebase/config";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Constants from "expo-constants";

const Settings = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const user = firebase.auth().currentUser;
	const usersRef = firebase.firestore().collection("users");

	state = {
		user: {
			name: "",
			email: "",
			avatar: null,
			password: "",
		},
	};

	useEffect(() => {
		if (user) {
			usersRef
				.doc(user.uid)
				.get()
				.then((doc) => {
					const data = doc.data();
					setName(data.name);
					setEmail(data.email);
					if (data.profileImageUrl) {
						setProfileImageSource({ uri: data.profileImageUrl });
					}
				});
		}
	}, [user]);

	const profileImageRef = useRef(null);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const handleUpdate = async () => {
		if (password !== confirmPassword) {
			Toast.show({
				type: "error",
				text1: "Error updating profile!",
				text2: "Passwords do not match.",
			});
			return;
		}

		try {
			if (name) {
				await user.updateProfile({ displayName: name });
				await usersRef.doc(user.uid).update({ name });
			}

			if (email && email !== user.email) {
				await user.updateEmail(email);
				await user.sendEmailVerification(); // Send email verification
				await usersRef.doc(user.uid).update({ email });
				Toast.show({
					type: "info",
					text1: "Email verification sent!",
					text2: "Please check your inbox to verify your new email address.",
				});
			}

			if (password) {
				await user.updatePassword(password);
			}

			Toast.show({
				type: "success",
				text1: "Profile updated successfully!",
			});
		} catch (error) {
			console.log(error.message);
			Toast.show({
				type: "error",
				text1: "Error updating profile!",
				text2: error.message,
			});
		}
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<SafeAreaView style={styles.container}>
				<View style={styles.logoContainer}>
					<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
				</View>
				<Text style={styles.label}>Name</Text>
				<View style={styles.inputContainer}>
					<TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} placeholder="Enter your name" />
				</View>
				<Text style={styles.label}>Email</Text>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={(text) => setEmail(text)}
						placeholder="Enter your email"
						keyboardType="email-address"
					/>
				</View>
				<Text style={styles.label}>Password</Text>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={(text) => setPassword(text)}
						placeholder="Enter your password"
						secureTextEntry
					/>
				</View>
				<Text style={styles.label}>Confirm password</Text>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={confirmPassword}
						onChangeText={(text) => setConfirmPassword(text)}
						placeholder="Enter your password"
						secureTextEntry
					/>
				</View>
				<TouchableOpacity onPress={handleUpdate} style={styles.primaryButton}>
					<View style={styles.buttonContent}>
						<Text style={styles.primaryButtonText}>Add new product</Text>
					</View>
				</TouchableOpacity>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default Settings;
