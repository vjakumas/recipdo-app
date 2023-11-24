import axios from "axios";
import firebase, { firestore } from "../config/firebase/config";
import Constants from "expo-constants";
import stringSimilarity from "string-similarity";
import Toast from "react-native-toast-message";

export const fetchRecipeDetails = async (recipeId) => {
	console.log(recipeId);
	const options = {
		method: "GET",
		url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
		headers: {
			"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
			"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		},
	};

	try {
		const response = await fetch(options.url, options);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching recipe details:", error);
	}
};

export const toggleSaveRecipe = async (recipe, isSaved, setIsSaved) => {
	const userId = firebase.auth().currentUser.uid;
	const userDocRef = firebase.firestore().collection("users").doc(userId);
	const userDoc = await userDocRef.get();
	const existingSavedRecipeIds = userDoc.data().savedRecipes || [];
	let updatedSavedRecipeIds;
	if (existingSavedRecipeIds.includes(recipe.id.toString())) {
		updatedSavedRecipeIds = existingSavedRecipeIds.filter((id) => id !== recipe.id.toString());
	} else {
		updatedSavedRecipeIds = [...existingSavedRecipeIds, recipe.id.toString()];
	}

	await userDocRef.update({
		savedRecipes: updatedSavedRecipeIds,
	});
	setIsSaved(!isSaved);
	return !isSaved;
};

export const fetchPantryItems = async () => {
	const userId = firebase.auth().currentUser.uid;
	const userDocRef = firebase.firestore().collection("users").doc(userId);
	const userDoc = await userDocRef.get();
	const userPantryItems = userDoc.data().pantryItems || [];
	return userPantryItems;
};

export const fetchIngredients = async (recipe) => {
	if (!recipe || !recipe.id) {
		console.error("Recipe is not defined");
		return;
	}
	const options = {
		method: "GET",
		url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/ingredientWidget.json`,
		headers: {
			"content-type": "application/octet-stream",
			"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
			"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);
		return response.data.ingredients;
	} catch (error) {
		console.error("Error fetching ingredients:", error);
	}
};

export const fetchNutritionData = async (recipe) => {
	try {
		const response = await axios.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/nutritionWidget.json`, {
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});
		// console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const isCommonMeasurement = (unit) => {
	const commonMeasurements = ["g", "ml", "kg", "l", "oz", "cup", "tsp", "tbsp", "pint", "quart", "gallon", "inch"];
	return commonMeasurements.includes(unit.toLowerCase());
};

export const isIngredientAvailable = async (ingredient, pantryItems) => {
	const similarityThreshold = 0.5;

	const matchingPantryItems = pantryItems.filter((item) => {
		const similarity = stringSimilarity.compareTwoStrings(item.name.toLowerCase().trim(), ingredient.name.toLowerCase().trim());
		// console.log(similarity + ":    Ingredient(recipe's): " + item.name + "    Product(user's): " + ingredient.name);
		return similarity >= similarityThreshold;
	});

	if (matchingPantryItems.length === 0) {
		return false;
	}

	let totalPantryItemQuantity = 0;

	const ingredientUnit = ingredient.amount.metric.unit || "unit";

	// If the ingredient's unit is not a common measurement, try to convert it to grams
	if (!isCommonMeasurement(ingredientUnit)) {
		try {
			const convertedIngredient = await convertIngredientAmount(
				ingredient.name,
				ingredientUnit,
				ingredient.amount.metric.unit,
				ingredient.amount.metric.value
			);
			if (convertedIngredient) {
				ingredient.amount.metric.value = convertedIngredient;
			} else {
				ingredient.amount.metric.unit = "unit";
			}
		} catch (error) {
			console.error("Error converting uncommon unit to grams:", error);
			ingredient.amount.metric.unit = "unit";
		}
	}

	// If the ingredient has a 'unit' measurement, sum the total pantry item quantity without conversion
	if (ingredientUnit === "unit") {
		totalPantryItemQuantity = parseInt(matchingPantryItems.reduce((acc, item) => parseInt(acc) + parseInt(item.quantity), 0));
		if (parseInt(totalPantryItemQuantity) >= parseInt(ingredient.amount.metric.value) === true) {
			return true;
		}
	}

	for (const item of matchingPantryItems) {
		if (item.unit === "unit") {
			continue;
		}
		const convertedAmount = await convertIngredientAmount(ingredient.name, ingredientUnit, item.unit, item.quantity);
		totalPantryItemQuantity += convertedAmount || 0;
	}

	if (!isCommonMeasurement(ingredient.amount.metric.unit) && ingredient.amount.metric.unit === "unit") {
		totalPantryItemQuantity = 0;
		for (const item of matchingPantryItems) {
			totalPantryItemQuantity += parseInt(item.quantity);
		}
		return totalPantryItemQuantity >= parseInt(ingredient.amount.metric.value);
	}

	const convertedIngredientAmount = await convertIngredientAmount(
		ingredient.name,
		matchingPantryItems[0].unit,
		ingredientUnit,
		ingredient.amount.metric.value
	);

	if (convertedIngredientAmount === null) {
		console.error("Error converting ingredient amount");
		return false;
	}

	return totalPantryItemQuantity >= convertedIngredientAmount;
};

export const checkIfRecipeIsSaved = async (recipe, setIsSaved) => {
	if (!recipe || !recipe.id) {
		console.error("Recipe is not defined");
		return;
	}
	const userId = firebase.auth().currentUser.uid;
	const userDocRef = firebase.firestore().collection("users").doc(userId);
	const userDoc = await userDocRef.get();
	const existingSavedRecipeIds = userDoc.data().savedRecipes || [];

	const isRecipeSaved = existingSavedRecipeIds.includes(recipe.id.toString());
	console.log("Is saved?: " + isRecipeSaved);
	setIsSaved(isRecipeSaved);
};

export const convertIngredientAmount = async (ingredientName, targetUnit, sourceUnit, sourceAmount) => {
	const options = {
		method: "GET",
		url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/convert",
		params: {
			ingredientName,
			targetUnit,
			sourceUnit,
			sourceAmount,
		},
		headers: {
			"content-type": "application/octet-stream",
			"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
			"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);
		return response.data.targetAmount;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const finishRecipe = async (recipe, navigation, hideModal, subtractIngredients, setModalLoading, ingredients, pantryItems) => {
	const userId = firebase.auth().currentUser.uid;
	const userRef = firestore.collection("users").doc(userId);

	try {
		setModalLoading(true);
		const userDoc = await userRef.get();
		let userData = userDoc.data();
		let finishedRecipes = userData.finishedRecipes || [];

		const newRecipe = {
			id: recipe.id,
			title: recipe.title,
			servings: recipe.servings,
			readyInMinutes: recipe.readyInMinutes,
			image: recipe.image,
			extendedIngredients: recipe.extendedIngredients,
			dishTypes: recipe.dishTypes,
			instructions: recipe.instructions,
		};

		finishedRecipes.push(newRecipe);

		await userRef.update({
			finishedRecipes: finishedRecipes,
		});

		await subtractIngredients(ingredients, pantryItems);

		Toast.show({
			type: "success",
			text1: "Recipe marked as finished!",
			text2: "Ingredients have been subtracted.",
			visibilityTime: 3000,
			autoHide: true,
			topOffset: 60,
			bottomOffset: 40,
		});
		setModalLoading(false);
		navigation.navigate("Home");

		hideModal();
	} catch (error) {
		setModalLoading(true);
		console.error("Error marking recipe as finished:", error);
		setModalLoading(false);
	}
};

const updateConsumedProducts = async (count, list) => {
	const userId = firebase.auth().currentUser.uid;
	const userRef = firestore.collection("users").doc(userId);

	await userRef.update({
		consumedProducts: firebase.firestore.FieldValue.increment(count),
		consumedProductsList: firebase.firestore.FieldValue.arrayUnion(...list),
	});
};

export const subtractIngredients = async (ingredients, pantryItems) => {
	const userId = firebase.auth().currentUser.uid;
	const userRef = firestore.collection("users").doc(userId);

	let consumedProductsCount = 0;
	let consumedProductsList = [];
	const similarityThreshold = 0.5;

	for (const ingredient of ingredients) {
		const matchingPantryItems = pantryItems.filter((item) => {
			const similarity = stringSimilarity.compareTwoStrings(item.name.toLowerCase().trim(), ingredient.name.toLowerCase().trim());
			// console.log(similarity + ":    Ingredient(recipe's): " + item.name + "    Product(user's): " + ingredient.name);
			return similarity >= similarityThreshold;
		});

		if (matchingPantryItems.length > 0) {
			matchingPantryItems.sort((a, b) => a.date - b.date);
			let remainingAmount = ingredient.amount.metric.value;
			for (const pantryItem of matchingPantryItems) {
				if (isCommonMeasurement(ingredient.amount.metric.unit)) {
					const convertedAmount = await convertIngredientAmount(
						ingredient.name,
						ingredient.amount.metric.unit,
						pantryItem.unit,
						pantryItem.quantity
					);
					if (convertedAmount > remainingAmount) {
						const convertedAmountToOriginal = await convertIngredientAmount(
							ingredient.name,
							pantryItem.unit,
							ingredient.amount.metric.unit,
							convertedAmount - remainingAmount
						);
						pantryItem.quantity = convertedAmountToOriginal.toString();
						remainingAmount = 0;
					} else {
						remainingAmount -= convertedAmount;
						consumedProductsCount += 1;

						const newItem = {
							name: pantryItem.name,
							pantryId: pantryItem.pantryId,
							image: pantryItem.productImageURL,
							consumedDate: new Date(),
							quantity: parseFloat(pantryItem.quantity.toFixed(3)),
							unit: pantryItem.unit,
							expiredDate: pantryItem.date,
							addedDate: pantryItem.addedDate,
							calories: pantryItem.calories,
							fat: pantryItem.fats,
							carbs: pantryItem.carbs,
							protein: pantryItem.protein,
						};

						consumedProductsList.push(newItem);

						pantryItem.quantity = 0;

						const index = pantryItems.indexOf(pantryItem);
						if (index !== -1) {
							pantryItems.splice(index, 1);
						}
					}

					if (remainingAmount <= 0) {
						break;
					}
				} else {
					if (pantryItem.quantity > remainingAmount) {
						pantryItem.quantity -= remainingAmount;
						pantryItem.quantity = pantryItem.quantity.toString();
						remainingAmount = 0;
					} else {
						remainingAmount -= pantryItem.quantity;

						const newItem = {
							name: pantryItem.name,
							pantryId: pantryItem.pantryId,
							image: pantryItem.productImageURL,
							consumedDate: new Date(),
							quantity: pantryItem.quantity,
							unit: pantryItem.unit,
							expiredDate: pantryItem.date,
							addedDate: pantryItem.addedDate,
							calories: pantryItem.calories,
							fat: pantryItem.fats,
							carbs: pantryItem.carbs,
							protein: pantryItem.protein,
						};

						consumedProductsList.push(newItem);

						pantryItem.quantity = 0;

						const index = pantryItems.indexOf(pantryItem);
						if (index !== -1) {
							pantryItems.splice(index, 1);
						}
					}

					if (remainingAmount <= 0) {
						break;
					}
				}
			}

			await userRef.update({
				pantryItems: pantryItems,
			});
		}
	}

	updateConsumedProducts(consumedProductsCount, consumedProductsList);
};
