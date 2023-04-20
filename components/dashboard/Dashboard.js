import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase/config";
import styles from "./dashboard.style";

const Dashboard = () => {
	const [name, setName] = useState("");

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

	return (
		<SafeAreaView style={styles.container}>
			<Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome {name.name}</Text>
			<TouchableOpacity style={styles.submitButton} onPress={() => firebase.auth().signOut()}>
				<Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Dashboard;
