import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase/config";
import styles from "./dashboard.style";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
	const [name, setName] = useState("");
	const navigation = useNavigation();

	useEffect(() => {
		firebase
			.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setName(snapshot.data());
					console.log(name);
				} else {
					console.log("User does not exist");
				}
			});
	}, []);

	const handleLogout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: "Auth" }],
				});
			});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome {name.name}</Text>
			<TouchableOpacity style={styles.submitButton} onPress={handleLogout}>
				<Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Dashboard;
