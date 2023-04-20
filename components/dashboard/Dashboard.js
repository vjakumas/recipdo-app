import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase/config";

const Dashboard = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		firebase
			.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setName(snapshot.data());
				} else {
					console.log("User does not exist");
				}
			});
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={{ fontsize: 20, fontWeight: "bold" }}>
				Welcome {name.firstName} {name.lastName}
			</Text>
			<TouchableOpacity style={styles.button} onPress={() => firebase.auth().signOut()}>
				<Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Dashboard;

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
