import axios from "axios";
import Constants from "expo-constants";
import firebase, { firestore } from "../config/firebase/config";

export const fetchUserData = async (setUserData) => {
	const userId = firebase.auth().currentUser.uid;
	try {
		const docRef = firebase.firestore().collection("users").doc(userId);

		const unsubscribe = docRef.onSnapshot((doc) => {
			if (doc.exists) {
				setUserData(doc.data());
			} else {
				console.log("No such document!");
			}
		});

		return () => unsubscribe();
	} catch (error) {
		console.log("Error getting document:", error);
	}
};

export const getTopConsumedProducts = (consumedProductsList) => {
	let productCounts = {};

	consumedProductsList.forEach((product) => {
		if (productCounts[product.name]) {
			productCounts[product.name] += 1; // Increment the count of the product by 1
		} else {
			productCounts[product.name] = 1; // Initialize the count of the product to 1
		}
	});

	const sortedProducts = Object.entries(productCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3);

	return sortedProducts.map(([name, count]) => ({ name, count }));
};

export const getTopFavoriteRecipes = (finishedRecipes) => {
	let recipeCounts = {};

	finishedRecipes.forEach((recipe) => {
		if (recipeCounts[recipe.id]) {
			recipeCounts[recipe.id].count += 1;
		} else {
			recipeCounts[recipe.id] = { ...recipe, count: 1 };
		}
	});

	const sortedRecipes = Object.values(recipeCounts)
		.sort((a, b) => b.count - a.count)
		.slice(0, 3);

	return sortedRecipes;
};
