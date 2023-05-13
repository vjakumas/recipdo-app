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
import stringSimilarity from "string-similarity";
import {
	fetchRecipeDetails,
	toggleSaveRecipe,
	fetchPantryItems,
	fetchIngredients,
	fetchNutritionData,
	isCommonMeasurement,
	isIngredientAvailable,
	checkIfRecipeIsSaved,
	convertIngredientAmount,
	finishRecipe,
	subtractIngredients,
} from "../../functions/RecipeDetailsFunctions";

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
			const fetchedPantryItemsData = await fetchPantryItems();
			setPantryItems(fetchedPantryItemsData);

			const fetchedIngredientData = await fetchIngredients(recipe);
			setIngredients(fetchedIngredientData);

			const checkIfRecipeIsSavedData = await checkIfRecipeIsSaved(recipe, setIsSaved);
			setIsSaved(checkIfRecipeIsSavedData);

			const fetchedNutritionData = await fetchNutritionData(recipe);
			setNutritionData(fetchedNutritionData);
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
					return await isIngredientAvailable(ingredient, pantryItems);
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

	const showModal = () => {
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const renderIngredients = () => {
		if (!nutritionData) {
			return <Text>Loading ingredients...</Text>;
		}

		const similarityThreshold = 0.5;

		return ingredients.map((ingredient, index) => {
			const matchingPantryItems = pantryItems.filter((item) => {
				const similarity = stringSimilarity.compareTwoStrings(item.name.toLowerCase().trim(), ingredient.name.toLowerCase().trim());
				// console.log(similarity + ":    Ingredient(recipe's): " + item.name + "    Product(user's): " + ingredient.name);
				return similarity >= similarityThreshold;
			});

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
										<TouchableOpacity
											style={styles.modalConfirmButton}
											onPress={() =>
												finishRecipe(
													recipe,
													navigation,
													hideModal,
													subtractIngredients,
													setModalLoading,
													ingredients,
													pantryItems
												)
											}>
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
