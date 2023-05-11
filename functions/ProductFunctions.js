import axios from "axios";
import Constants from "expo-constants";
import firebase, { firestore } from "../config/firebase/config";
import Toast from "react-native-toast-message";

export const removeProduct = async (reason, pantryId, navigation, Toast) => {
	if (!reason) {
		Toast.show({
			type: "error",
			text1: "Reason not selected!",
			text2: "Please select a reason for removing the product.",
			visibilityTime: 4000,
			autoHide: true,
			topOffset: 60,
			bottomOffset: 40,
		});
		return;
	}
	try {
		const userId = firebase.auth().currentUser.uid;
		const userDocRef = firebase.firestore().collection("users").doc(userId);
		const userDoc = await userDocRef.get();
		const existingPantryItems = userDoc.data().pantryItems || [];

		const productToRemove = existingPantryItems.find((item) => item.pantryId === pantryId);
		const updatedPantryItems = existingPantryItems.filter((item) => item.pantryId !== pantryId);

		const updates = {
			pantryItems: updatedPantryItems,
		};

		if (reason === "Expired") {
			const expiredProductsList = userDoc.data().expiredProductsList || [];
			updates.expiredProductsList = [...expiredProductsList, productToRemove];
			updates.expiredProducts = firebase.firestore.FieldValue.increment(1);
		} else if (reason === "Already consumed") {
			const consumedProductsList = userDoc.data().consumedProductsList || [];
			updates.consumedProductsList = [...consumedProductsList, productToRemove];
			updates.consumedProducts = firebase.firestore.FieldValue.increment(1);
		}

		await userDocRef.update(updates);

		Toast.show({
			type: "success",
			text1: "Product removed!",
			text2: "The product has been removed from your pantry.",
			visibilityTime: 4000,
			autoHide: true,
			topOffset: 60,
			bottomOffset: 40,
		});

		navigation.navigate("PantryList");
	} catch (error) {
		console.error("Error removing product:", error);
	}
};

export const getSuggestions = async (name) => {
	try {
		const response = await axios.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete", {
			params: {
				query: name,
				number: "8",
			},
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error fetching suggestions:", error);
	}
};
