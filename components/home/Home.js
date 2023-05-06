import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl } from "react-native";
import firebase, { firestore } from "../../config/firebase/config";
import styles from "./home.style";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RecipeCardMediumList from "../common/cards/recipeCardMedium/RecipeCardMediumList";
import RecipeCardMediumSafeFoodList from "../common/cards/recipeCardMediumSafeFood/RecipeCardMediumSafeFoodList";
import ProfileDropdown from "../common/dropdown/profileDropdown/ProfileDropdown";
import axios from "axios";
import Constants from "expo-constants";

const Home = ({ navigation }) => {
	const [userData, setUserData] = useState("");
	const [recommendedRecipes, setRecommendedRecipes] = useState([]);
	const [saveTheFoodRecipes, setSaveTheFoodRecipes] = useState([]);
	const [makeItAgainRecipes, setMakeItAgainRecipes] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		firebase
			.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setUserData(snapshot.data());
				} else {
					console.log("User does not exist");
				}
			});
		updateExpiringItems();

		// COMMENT/UNCOMMENT THIS LINE TO FETCH RECIPES
		setLoading(false);

		// UNCOMMENT/COMMENT THIS CODE TO FETCH RECIPES
		// Promise.all([fetchRecommendedRecipes(), fetchSaveTheFoodRecipes(), fetchMakeItAgainRecipes()]).then(() => {
		// 	setLoading(false);
		// });
	}, []);

	const handleRefresh = async () => {
		setRefreshing(true);
		// UNCOMMENT/COMMENT THIS CODE TO FETCH RECIPES
		// Promise.all([fetchRecommendedRecipes(), fetchSaveTheFoodRecipes(), fetchMakeItAgainRecipes()]).then(() => {
		// 	setLoading(false);
		// });
		setRefreshing(false);
	};

	const fetchRecommendedRecipes = async () => {
		const recipes = await getRecommendedRecipes();
		setRecommendedRecipes(recipes);
	};

	const profileDropdownRef = useRef(null);

	const toggleDropdown = () => {
		if (profileDropdownRef.current) {
			profileDropdownRef.current.toggleDropdown();
		}
	};

	const isDateInPast = (date1, date2) => {
		const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
		const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
		return d1 < d2;
	};

	const updateExpiringItems = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.firestore().collection("users").doc(userId);

		const userData = await userRef.get();
		const productsLastCheckDate = userData.data().productsLastCheckDate.toDate();
		const today = new Date();
		const fiveDaysLater = new Date(today);
		fiveDaysLater.setDate(today.getDate() + 5);

		if (isDateInPast(productsLastCheckDate, today)) {
			const pantryItems = userData.data().pantryItems;

			const updatedPantryItems = pantryItems.map((item) => {
				const itemDate = item.date.toDate();
				if (itemDate > today && itemDate <= fiveDaysLater && !item.isExpiringSoon) {
					return { ...item, isExpiringSoon: true };
				}
				return item;
			});

			const expiringProductsCount = updatedPantryItems.filter((item) => item.isExpiringSoon).length;

			await userRef.update({ pantryItems: updatedPantryItems });
			await userRef.update({ productsLastCheckDate: firebase.firestore.Timestamp.fromDate(new Date()) });
			await userRef.update({ expiringProducts: expiringProductsCount });
			await removeExpiredItems();
		}
	};

	const removeExpiredItems = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.firestore().collection("users").doc(userId);

		const userData = await userRef.get();
		const pantryItems = userData.data().pantryItems;
		const today = new Date();

		let expiredProductsCount = 0;

		const nonExpiredPantryItems = pantryItems.filter((item) => {
			const itemDate = item.date.toDate();
			if (itemDate < today) {
				expiredProductsCount++;
				return false;
			}
			return true;
		});

		await userRef.update({ pantryItems: nonExpiredPantryItems });
		await userRef.update({ expiredProducts: firebase.firestore.FieldValue.increment(expiredProductsCount) });
	};

	const handleLogout = () => {
		toggleDropdown();
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

	const handleSettings = () => {
		toggleDropdown();
		navigation.navigate("Settings");
	};

	const handleStatistics = () => {
		toggleDropdown();
		navigation.navigate("Statistics");
	};

	const fetchMakeItAgainRecipes = async () => {
		try {
			const userId = firebase.auth().currentUser.uid;
			const userDoc = await firestore.collection("users").doc(userId).get();
			const finishedRecipes = userDoc.data().finishedRecipes || [];

			if (finishedRecipes.length > 0) {
				const recipeIds = finishedRecipes.map((recipe) => recipe.id);
				const uniqueRecipeIds = new Set(recipeIds);
				const uniqueFinishedRecipeIds = Array.from(uniqueRecipeIds);

				const recipes = await getRecipeInformationBulk(uniqueFinishedRecipeIds);
				setMakeItAgainRecipes(recipes);
			}
		} catch (error) {
			console.error("Error fetching make it again recipes:", error);
		}
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

	const fetchPantryItems = async (userId) => {
		const userRef = firestore.collection("users").doc(userId);
		const userDoc = await userRef.get();
		const pantryItemsLOL = userDoc.data().pantryItems;

		return pantryItemsLOL;
	};

	const timestampToDate = (timestamp) => {
		return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
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

	const getSaveTheFoodRecipes = async (userId) => {
		const pantryItems = await fetchPantryItems(userId);
		if (pantryItems.length === 0) {
			const randomRecipes = await getRandomRecipes(10);
			return randomRecipes;
		} else {
			const prioritizedPantryItems = prioritizePantryItems(pantryItems);
			const recipes = await fetchRecipesForSaveTheFood(prioritizedPantryItems);
			return recipes;
		}
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

		for (let i = prioritizedPantryItems.length; i >= 0; i--) {
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

	const fetchSaveTheFoodRecipes = async () => {
		const userId = firebase.auth().currentUser.uid;
		const recipes = await getSaveTheFoodRecipes(userId);
		setSaveTheFoodRecipes(recipes);
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
			console.log("Pirmas" + uniqueFinishedRecipes);

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
			console.log("TRECIAS" + uniqueFinishedRecipes);
			const randomRecipesRes = await getRandomRecipes(10);
			recipeIds = randomRecipesRes;
		}

		// Get detailed information for these recipes using the recipe information bulk API
		const recommendedRecipes = await getRecipeInformationBulk(recipeIds);

		return recommendedRecipes;
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
				<View style={styles.rightIcons}>
					<Ionicons name="notifications-outline" size={24} color={COLORS.darkGray} style={styles.notificationIcon} />
					<ProfileDropdown
						ref={profileDropdownRef}
						handleSettings={handleSettings}
						handleLogout={handleLogout}
						handleStatistics={handleStatistics}
					/>
				</View>
			</View>
			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}>
					<View style={styles.recipesContainer}>
						<View style={styles.categorySectionSaveTheFood}>
							<View style={styles.categoryHeaderSaveTheFood}>
								<Text style={styles.categoryTitleSaveTheFood}>Save-the-food recipes</Text>
								{/* <TouchableOpacity style={styles.seeAllButton}>
									<Text style={styles.seeAllText}>See all</Text>
								</TouchableOpacity> */}
							</View>
							<RecipeCardMediumSafeFoodList recipes={saveTheFoodRecipes} navigation={navigation} />
						</View>
						<View style={styles.categorySection}>
							<View style={styles.categoryHeader}>
								<Text style={styles.categoryTitle}>Recommended for you</Text>
								{/* <TouchableOpacity style={styles.seeAllButton}>
									<Text style={styles.seeAllText}>See all</Text>
								</TouchableOpacity> */}
							</View>
							<RecipeCardMediumList recipes={recommendedRecipes} navigation={navigation} />
						</View>

						<View style={styles.categorySection}>
							<View style={styles.categoryHeader}>
								<Text style={styles.categoryTitle}>Make it again</Text>
								{/* <TouchableOpacity style={styles.seeAllButton}>
									<Text style={styles.seeAllText}>See all</Text>
								</TouchableOpacity> */}
							</View>
							<RecipeCardMediumList recipes={makeItAgainRecipes} navigation={navigation} />
						</View>
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default Home;
