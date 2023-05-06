import React, { useState, useEffect, useCallback } from "react";
import {
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	View,
	Text,
	Image,
	Modal,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";

import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import Toast from "react-native-toast-message";
import styles from "./recipeDetails.style";
import firebase, { firestore } from "../../config/firebase/config";
import axios from "axios";
import Constants from "expo-constants";

const RecipeDetails = ({ route, navigation }) => {
	const [recipe, setRecipe] = useState(route.params.recipe);
	const title = recipe?.title || "";
	const servings = recipe?.servings || "";
	const image = recipe?.image || "";
	const dishType = recipe?.dishTypes?.[0] || "";
	const readyInMinutes = recipe?.readyInMinutes || 0;
	const instructions = recipe?.instructions || "";
	const [pantryItems, setPantryItems] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [nutritionData, setNutritionData] = useState(null);
	const [isSaved, setIsSaved] = useState(false);
	const [ingredientAvailability, setIngredientAvailability] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSteps, setSelectedSteps] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalLoading, setModalLoading] = useState(false);

	useEffect(() => {
		if ("missedIngredientCount" in route.params.recipe) {
			fetchRecipeDetails(route.params.recipe.id);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			await fetchPantryItems();
			await fetchIngredients();
			await checkIfRecipeIsSaved();
			await fetchNutritionData();
			setIsLoading(false);
		};
		setIsLoading(true);
		fetchData();
		setSelectedSteps([]);
		setIngredientAvailability([]);
	}, [recipe]);

	useEffect(() => {
		let isCancelled = false;

		const updateIngredientAvailability = async () => {
			if (ingredients.length === 0 || pantryItems.length === 0) {
				return;
			}

			const availability = await Promise.all(
				ingredients.map(async (ingredient) => {
					return await isIngredientAvailable(ingredient);
				})
			);

			if (!isCancelled) {
				// console.log("Ingredient Availability:", availability);
				setIngredientAvailability(availability);
			}
		};

		updateIngredientAvailability();

		return () => {
			isCancelled = true;
		};
	}, [pantryItems, ingredients]);

	const fetchRecipeDetails = async (recipeId) => {
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
			setRecipe(data);
		} catch (error) {
			console.error("Error fetching recipe details:", error);
		}
	};

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

	const fetchPantryItems = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userDocRef = firebase.firestore().collection("users").doc(userId);
		const userDoc = await userDocRef.get();
		const userPantryItems = userDoc.data().pantryItems || [];
		setPantryItems(userPantryItems);
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

	const showModal = () => {
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	// Helper function to check if a unit is a common measurement
	const isCommonMeasurement = (unit) => {
		const commonMeasurements = ["g", "ml", "kg", "l", "oz", "cup", "tsp", "tbsp", "pint", "quart", "gallon", "inch"];
		return commonMeasurements.includes(unit.toLowerCase());
	};

	const isIngredientAvailable = async (ingredient) => {
		const matchingPantryItems = pantryItems.filter((item) => item.name.toLowerCase().trim() === ingredient.name.toLowerCase().trim());
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

	const finishRecipe = async (recipe) => {
		setModalLoading(true);
		const userId = firebase.auth().currentUser.uid;
		const userRef = firestore.collection("users").doc(userId);

		try {
			const userDoc = await userRef.get();
			const finishedRecipes = userDoc.data().finishedRecipes;

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

			await subtractIngredients();

			Toast.show({
				type: "success",
				text1: "Recipe marked as finished!",
				text2: "Ingredients have been subtracted.",
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 60,
				bottomOffset: 40,
			});

			navigation.navigate("Home");

			hideModal();
		} catch (error) {
			console.error("Error marking recipe as finished:", error);
			setModalLoading(false);
		}
		setModalLoading(false);
	};

	const renderIngredients = () => {
		if (!nutritionData) {
			return <Text>Loading ingredients...</Text>;
		}

		return ingredients.map((ingredient, index) => {
			const matchingPantryItems = pantryItems.filter((item) => item.name.toLowerCase().trim() === ingredient.name.toLowerCase().trim());

			let totalPantryItemSum = 0;
			for (const item of matchingPantryItems) {
				totalPantryItemSum += parseFloat(item.quantity);
			}
			const ingredientUnit = ingredient.amount.metric.unit || "unit";
			const pantryQuantityDisplay = matchingPantryItems.length ? `${totalPantryItemSum} ${matchingPantryItems[0].unit}` : `0 ${ingredientUnit}`;
			return (
				<View style={styles.ingredientRow} key={index}>
					<FontAwesome
						name={ingredientAvailability[index] ? "chevron-circle-down" : "circle-o"}
						size={24}
						color={ingredientAvailability[index] ? COLORS.primary : COLORS.lightGray}
						style={styles.ingredientIcon}
					/>
					<Text style={styles.text}>
						<Text style={styles.boldText}>{ingredient.amount.metric.value}</Text> <Text style={styles.boldText}>{ingredientUnit}</Text>{" "}
						{ingredient.name} <Text style={{ color: "gray" }}>({pantryQuantityDisplay})</Text>
					</Text>
				</View>
			);
		});
	};

	const subtractIngredients = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firestore.collection("users").doc(userId);

		let consumedProductsCount = 0;
		let consumedProductsList = [];

		for (const ingredient of ingredients) {
			const matchingPantryItems = pantryItems.filter((item) => item.name.toLowerCase().trim() === ingredient.name.toLowerCase().trim());

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
				updateConsumedProducts(consumedProductsCount, consumedProductsList);
			}
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

	const onInstructionStepClick = (index) => {
		if (selectedSteps.includes(index)) {
			setSelectedSteps(selectedSteps.filter((stepIndex) => stepIndex !== index));
		} else {
			setSelectedSteps([...selectedSteps, index]);
		}
	};

	const renderInstructions = () => {
		if (!instructions || instructions === "No instructions provided") {
			return <Text style={styles.text}>No instructions provided</Text>;
		}

		const steps = instructions.split(".").filter((step) => step.trim().length > 0);

		return (
			<View style={styles.instructionsContainer}>
				{steps.map((step, index) => {
					const isSelected = selectedSteps.includes(index);
					return (
						<TouchableOpacity
							key={index}
							style={[styles.instructionStep, isSelected ? styles.instructionStepSelected : {}]}
							onPress={() => onInstructionStepClick(index)}>
							<View style={[styles.instructionBulletContainer, isSelected ? styles.instructionBulletContainerSelected : {}]}>
								{isSelected ? (
									<FontAwesome name="chevron-circle-down" style={styles.instructionCheck} />
								) : (
									<Text style={styles.instructionBullet}>{index + 1}</Text>
								)}
							</View>
							<Text style={[styles.instructionText, isSelected ? styles.instructionTextSelected : {}]}>{step.trim()}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{modalLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : (
				<>
					<Modal animationType="fade" transparent={true} visible={modalVisible}>
						<TouchableWithoutFeedback onPress={hideModal}>
							<View style={styles.modalOverlay}>
								<View style={styles.modalContainer}>
									<Text style={styles.modalTitle}>Finish Recipe</Text>
									<Text style={styles.modalText}>Are you sure you want to finish this recipe and subtract the ingredients?</Text>
									<View style={styles.modalButtonsContainer}>
										<TouchableOpacity style={styles.modalCancelButton} onPress={hideModal}>
											<Text style={styles.modalCancelButtonText}>Cancel</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.modalConfirmButton} onPress={() => finishRecipe(recipe)}>
											<Text style={styles.modalConfirmButtonText}>Confirm</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</Modal>
					{isLoading ? (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<ActivityIndicator size="large" color={COLORS.primary} />
						</View>
					) : (
						<ScrollView showsVerticalScrollIndicator={false}>
							<View>
								<Image style={styles.image} source={{ uri: image }} />
								<View style={styles.dishTypeContainer}>
									<Text style={styles.dishType}>{dishType ? dishType.charAt(0).toUpperCase() + dishType.slice(1) : ""}</Text>
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
								<Text style={styles.servings}>{servings} servings</Text>
								{nutritionData && (
									<View style={styles.nutritionContainer}>
										<Text style={styles.nutritionTitle}>Nutrition Facts</Text>
										<View style={styles.nutritionRow}>
											<View style={styles.nutritionItem}>
												<View style={styles.nutritionIcon}>
													<MaterialIcons name="local-fire-department" size={24} color={COLORS.darkGray} />
												</View>
												<Text style={styles.nutritionText}>{nutritionData.calories} Kcal</Text>
											</View>
											<View style={styles.nutritionItem}>
												<View style={styles.nutritionIcon}>
													<MaterialIcons name="free-breakfast" size={24} color={COLORS.darkGray} />
												</View>
												<Text style={styles.nutritionText}>{nutritionData.carbs} carbs</Text>
											</View>
										</View>
										<View style={styles.nutritionRow}>
											<View style={styles.nutritionItem}>
												<View style={styles.nutritionIcon}>
													<MaterialIcons name="fitness-center" size={24} color={COLORS.darkGray} />
												</View>
												<Text style={styles.nutritionText}>{nutritionData.protein} protein</Text>
											</View>
											<View style={styles.nutritionItem}>
												<View style={styles.nutritionIcon}>
													<MaterialIcons name="fastfood" size={24} color={COLORS.darkGray} />
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
								<TouchableOpacity style={styles.submitButton} onPress={showModal}>
									<Text style={styles.submitButtonText}>Finish recipe</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					)}
				</>
			)}
		</SafeAreaView>
	);
};

export default RecipeDetails;
