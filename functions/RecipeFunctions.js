import axios from "axios";
import Constants from "expo-constants";
import firebase, { firestore } from "../config/firebase/config";

export const fetchRecommendedRecipes = async () => {
	const recipes = await getRecommendedRecipes();
	return recipes;
};

export const fetchMakeItAgainRecipes = async () => {
	try {
		const userId = firebase.auth().currentUser.uid;
		const userDoc = await firestore.collection("users").doc(userId).get();
		const finishedRecipes = userDoc.data().finishedRecipes || [];

		if (finishedRecipes.length > 0) {
			const recipeIds = finishedRecipes.map((recipe) => recipe.id);
			const uniqueRecipeIds = new Set(recipeIds);
			const uniqueFinishedRecipeIds = Array.from(uniqueRecipeIds);

			const recipes = await getRecipeInformationBulk(uniqueFinishedRecipeIds);
			return recipes;
		}
	} catch (error) {
		console.error("Error fetching make it again recipes:", error);
	}
};

export const fetchSaveTheFoodRecipes = async () => {
	const userId = firebase.auth().currentUser.uid;
	const recipes = await getSaveTheFoodRecipes(userId);
	return recipes;
};

const getRecommendedRecipes = async () => {
	const userId = firebase.auth().currentUser.uid;
	const userRef = firestore.collection("users").doc(userId);

	// Get user's saved and finished recipes
	const userDoc = await userRef.get();
	const savedRecipes = userDoc.data().savedRecipes;
	const finishedRecipes = userDoc.data().finishedRecipes;

	const uniqueRecipeIds = new Set();

	// Iterate over the finishedRecipes array
	for (let recipe of finishedRecipes) {
		// Add the recipe ID to the uniqueRecipeIds Set
		uniqueRecipeIds.add(recipe.id);
	}
	// Convert the Set back to an array
	const uniqueFinishedRecipes = Array.from(uniqueRecipeIds);

	let recipeIds = [];

	if (uniqueFinishedRecipes.length >= 5) {
		for (let i = 0; i < 5; i++) {
			const similarRecipesRes = await getSimilarRecipes(uniqueFinishedRecipes[i], 2);
			recipeIds = recipeIds.concat(similarRecipesRes);
		}
	} else if (uniqueFinishedRecipes.length > 0) {
		const recipeDistribution = [
			[10], // 1 finished recipe
			[5, 5], // 2 finished recipes
			[3, 4, 3], // 3 finished recipes
			[2, 3, 2, 3], // 4 finished recipes
		];

		const distribution = recipeDistribution[uniqueFinishedRecipes.length - 1];

		for (let i = 0; i < uniqueFinishedRecipes.length; i++) {
			const similarRecipesRes = await getSimilarRecipes(uniqueFinishedRecipes[i], distribution[i]);
			recipeIds = recipeIds.concat(similarRecipesRes);
		}
	} else {
		const randomRecipesRes = await getRandomRecipes(10);
		recipeIds = randomRecipesRes;
	}

	// Get detailed information for these recipes using the recipe information bulk API
	const recommendedRecipes = await getRecipeInformationBulk(recipeIds);

	return recommendedRecipes;
};

const getSimilarRecipes = async (recipeId, number) => {
	try {
		const response = await axios({
			method: "GET",
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/similar`,
			headers: {
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});

		return response.data.slice(0, number).map((recipe) => recipe.id);
	} catch (error) {
		console.error("Error fetching similar recipes:", error);
		return [];
	}
};

const getRandomRecipes = async (number) => {
	try {
		const response = await axios({
			method: "GET",
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random`,
			params: {
				number,
			},
			headers: {
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});

		return response.data.recipes.map((recipe) => recipe.id);
	} catch (error) {
		console.error("Error fetching random recipes:", error);
		return [];
	}
};

const getRecipeInformationBulk = async (recipeIds) => {
	try {
		const response = await axios({
			method: "GET",
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk`,
			params: {
				ids: recipeIds.join(","),
			},
			headers: {
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error fetching recipe information bulk:", error);
		return [];
	}
};

const getSaveTheFoodRecipes = async (userId) => {
	const pantryItems = await fetchPantryItems(userId);
	if (pantryItems.length === 0) {
		const randomRecipes = await getRandomRecipes(10);
		return randomRecipes;
	} else {
		const prioritizedPantryItems = prioritizePantryItems(pantryItems);
		console.log(prioritizedPantryItems);
		const recipes = await fetchRecipesForSaveTheFood(prioritizedPantryItems);
		return recipes;
	}
};

const fetchPantryItems = async (userId) => {
	const userRef = firestore.collection("users").doc(userId);
	const userDoc = await userRef.get();
	const pantryItemsLOL = userDoc.data().pantryItems;

	return pantryItemsLOL;
};

const prioritizePantryItems = (pantryItems) => {
	const currentDate = new Date();

	const sortItemsByExpiringSoonAndDate = (items) =>
		items.sort((a, b) => {
			const aDate = timestampToDate(a.date);
			const bDate = timestampToDate(b.date);

			const aDaysUntilExpiration = (aDate - currentDate) / (1000 * 60 * 60 * 24);
			const bDaysUntilExpiration = (bDate - currentDate) / (1000 * 60 * 60 * 24);

			if (a.isExpiringSoon !== b.isExpiringSoon) {
				return a.isExpiringSoon ? -1 : 1;
			} else {
				if (aDaysUntilExpiration < bDaysUntilExpiration) {
					return -1;
				} else if (aDaysUntilExpiration > bDaysUntilExpiration) {
					return 1;
				} else {
					return 0;
				}
			}
		});

	const sortedItems = sortItemsByExpiringSoonAndDate(pantryItems);

	return sortedItems;
};

const fetchRecipesForSaveTheFood = async (prioritizedPantryItems) => {
	const requiredRecipes = 10;
	let fetchedRecipes = [];

	const fetchRecipes = async (ingredients) => {
		const options = {
			method: "GET",
			url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
			params: {
				ingredients: ingredients,
				number: requiredRecipes - fetchedRecipes.length,
			},
			headers: {
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	for (let i = 5; i >= 0; i--) {
		const ingredients = prioritizedPantryItems
			.slice(0, i)
			.map((item) => item.name)
			.join(",");
		const recipes = await fetchRecipes(ingredients);
		fetchedRecipes = fetchedRecipes.concat(recipes);
		if (fetchedRecipes.length >= requiredRecipes) {
			break;
		}
	}
	return fetchedRecipes;
};

const timestampToDate = (timestamp) => {
	return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

export const fetchSavedRecipes = async (setRecipes, setIsLoading) => {
	try {
		const userId = firebase.auth().currentUser.uid;
		const userDoc = await firestore.collection("users").doc(userId).get();
		const savedRecipeIds = userDoc.data().savedRecipes.join(",");
		const options = {
			method: "GET",
			url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
			params: { ids: savedRecipeIds },
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};

		const response = await axios.request(options);
		setRecipes(response.data);
	} catch (error) {
		console.error("Error fetching saved recipes:", error);
	} finally {
		setIsLoading(false);
	}
};
