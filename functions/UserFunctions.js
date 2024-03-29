import firebase from "../config/firebase/config";

export const fetchUserData = async () => {
	let userData = null;
	try {
		const snapshot = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get();

		if (snapshot.exists) {
			userData = snapshot.data();
			console.log(userData);
		} else {
			console.log("User does not exist");
		}
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
	return userData;
};
