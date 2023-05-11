import axios from "axios";
import Constants from "expo-constants";
import firebase, { firestore } from "../config/firebase/config";

export const fetchUserData = async () => {
	let userData = null;
	try {
		const snapshot = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get();

		if (snapshot.exists) {
			userData = snapshot.data();
		} else {
			console.log("User does not exist");
		}
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
	return userData;
};
