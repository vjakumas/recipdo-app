import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import styles from "./recipeDetails.style";
import firebase, { firestore } from "../../config/firebase/config";
import axios from "axios";
import Constants from "expo-constants";

const RecipeDetails = ({ route }) => {
	const { recipe } = route.params;
	const title = recipe.title;
	const image = recipe.image;
	const dishType = recipe.dishTypes[0];
	const readyInMinutes = recipe.readyInMinutes;
	const instructions = recipe.instructions;
	const [pantryItems, setPantryItems] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [nutritionData, setNutritionData] = useState(null);
	const [isSaved, setIsSaved] = useState(false);
	const [ingredientAvailability, setIngredientAvailability] = useState([]);
	const [availableIngredientsData, setAvailableIngredientsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIngredientAvailability([]);
			await fetchPantryList();
			await fetchIngredients();
			await checkIfRecipeIsSaved();
			await fetchNutritionData();
			setIsLoading(false);
		};
		setIsLoading(true);
		fetchData();
	}, [recipe]);

	useEffect(() => {
		const updateIngredientAvailability = async () => {
			if (ingredients.length === 0 || pantryItems.length === 0) {
				return;
			}

			const availability = await Promise.all(
				ingredients.map(async (ingredient) => {
					return await isIngredientAvailable(ingredient);
				})
			);
			console.log("Ingredient Availability:", availability);
			setIngredientAvailability(availability);
		};
		setIngredientAvailability([]);
		updateIngredientAvailability();
	}, [pantryItems, ingredients]);

	const toggleSaveRecipe = async () => {
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
	};

	const fetchPantryList = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userDocRef = firebase.firestore().collection("users").doc(userId);
		const userDoc = await userDocRef.get();
		const userPantryList = userDoc.data().pantryItems || [];
		setPantryItems(userPantryList);
	};

	const fetchIngredients = async () => {
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
			setIngredients(response.data.ingredients);
		} catch (error) {
			console.error("Error fetching ingredients:", error);
		}
	};

	const fetchNutritionData = async () => {
		try {
			const response = await axios.get(
				`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/nutritionWidget.json`,
				{
					headers: {
						"content-type": "application/octet-stream",
						"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
						"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
					},
				}
			);
			setNutritionData(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	const isIngredientAvailable = async (ingredient) => {
		const pantryItem = pantryItems.find((item) => item.name.toLowerCase().trim() === ingredient.name.toLowerCase().trim());

		if (pantryItem === undefined) {
			return false;
		}

		const convertedAmount = await convertIngredientAmount(
			ingredient.name,
			pantryItem.unit,
			ingredient.amount.metric.unit,
			ingredient.amount.metric.value
		);

		if (convertedAmount === null) {
			console.error("Error converting ingredient amount");
			return false;
		}
		console.log(pantryItem.quantity + "  " + convertedAmount);

		const isAvailable = pantryItem.quantity >= convertedAmount;

		if (isAvailable) {
			setAvailableIngredientsData((prevState) => [
				...prevState,
				{
					name: ingredient.name,
					originalQuantity: pantryItem.quantity,
					recipeNeededQuantity: convertedAmount,
				},
			]);
		}

		return isAvailable;
	};

	const checkIfRecipeIsSaved = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userDocRef = firebase.firestore().collection("users").doc(userId);
		const userDoc = await userDocRef.get();
		const existingSavedRecipeIds = userDoc.data().savedRecipes || [];

		const isRecipeSaved = existingSavedRecipeIds.includes(recipe.id.toString());
		setIsSaved(isRecipeSaved);
	};

	const convertIngredientAmount = async (ingredientName, targetUnit, sourceUnit, sourceAmount) => {
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

	const finishRecipe = async (recipeId) => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firestore.collection("users").doc(userId);

		try {
			await userRef.update({
				finishedRecipes: firebase.firestore.FieldValue.arrayUnion(recipeId),
			});
			alert("Recipe marked as finished!");
		} catch (error) {
			console.error("Error marking recipe as finished:", error);
		}
	};

	const renderIngredients = () => {
		if (!nutritionData) {
			return <Text>Loading ingredients...</Text>;
		}

		return ingredients.map((ingredient, index) => (
			<View style={styles.ingredientRow} key={index}>
				<FontAwesome
					name={ingredientAvailability[index] ? "chevron-circle-down" : "circle-o"}
					size={24}
					color={ingredientAvailability[index] ? COLORS.primary : COLORS.lightGray}
					style={styles.ingredientIcon}
				/>
				<Text style={[styles.text, ingredientAvailability[index] ? styles.strikethroughText : null]}>
					<Text style={styles.boldText}>{ingredient.amount.metric.value}</Text>{" "}
					<Text style={styles.boldText}>{ingredient.amount.metric.unit}</Text> {ingredient.name}
				</Text>
			</View>
		));
	};

	const renderInstructions = () => {
		if (!instructions || instructions === "No instructions provided") {
			return <Text style={styles.text}>No instructions provided</Text>;
		}

		const steps = instructions.split(".").filter((step) => step.trim().length > 0);

		return (
			<View style={styles.instructionsContainer}>
				{steps.map((step, index) => (
					<View key={index} style={styles.instructionStep}>
						<View style={styles.instructionBulletContainer}>
							<Text style={styles.instructionBullet}>{index + 1}</Text>
						</View>
						<Text style={styles.instructionText}>{step.trim()}</Text>
					</View>
				))}
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{isLoading ? (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<View>
						<Image style={styles.image} source={{ uri: image }} />
						<View style={styles.dishTypeContainer}>
							<Text style={styles.dishType}>{dishType}</Text>
						</View>
						<View style={styles.readyInMinutesContainer}>
							<Text style={styles.readyInMinutes}>
								<MaterialIcons name="timer" size={16} color="white" /> {readyInMinutes} min
							</Text>
						</View>
					</View>
					<View style={styles.container}>
						<View style={styles.header}>
							<Text style={styles.title}>{title}</Text>
							<TouchableOpacity style={styles.saveRecipeButton} onPress={toggleSaveRecipe}>
								{isSaved ? (
									<MaterialIcons name="favorite" size={24} color="red" />
								) : (
									<MaterialIcons name="favorite-border" size={24} color="red" />
								)}
							</TouchableOpacity>
						</View>
						{nutritionData && (
							<View style={styles.nutritionContainer}>
								<Text style={styles.nutritionTitle}>{recipe.id}</Text>
								<Text style={styles.nutritionTitle}>Nutrition Facts</Text>
								<View style={styles.nutritionRow}>
									<View style={styles.nutritionItem}>
										<View style={styles.nutritionIcon}>
											<MaterialIcons name="local-fire-department" size={24} color={COLORS.secondary} />
										</View>
										<Text style={styles.nutritionText}>{nutritionData.calories} Kcal</Text>
									</View>
									<View style={styles.nutritionItem}>
										<View style={styles.nutritionIcon}>
											<MaterialIcons name="free-breakfast" size={24} color={COLORS.secondary} />
										</View>
										<Text style={styles.nutritionText}>{nutritionData.carbs} carbs</Text>
									</View>
								</View>
								<View style={styles.nutritionRow}>
									<View style={styles.nutritionItem}>
										<View style={styles.nutritionIcon}>
											<MaterialIcons name="fitness-center" size={24} color={COLORS.secondary} />
										</View>
										<Text style={styles.nutritionText}>{nutritionData.protein} protein</Text>
									</View>
									<View style={styles.nutritionItem}>
										<View style={styles.nutritionIcon}>
											<MaterialIcons name="fastfood" size={24} color={COLORS.secondary} />
										</View>
										<Text style={styles.nutritionText}>{nutritionData.fat} fat</Text>
									</View>
								</View>
							</View>
						)}
						<View style={styles.ingredientsContainer}>
							<Text style={styles.ingredientsTitle}>Ingredients</Text>
							{renderIngredients()}
						</View>
						<Text style={styles.instructionsTitle}>Instructions</Text>
						{renderInstructions()}
						<TouchableOpacity style={styles.submitButton} onPress={() => finishRecipe(recipe.id)}>
							<Text style={styles.submitButtonText}>Finish recipe</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default RecipeDetails;
