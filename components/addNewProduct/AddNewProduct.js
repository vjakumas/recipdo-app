import React, { useState, useEffect } from "react";
import {
	View,
	Alert,
	Text,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
	ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./addNewProduct.style";
import firebase, { firestore } from "../../config/firebase/config";
import Toast from "react-native-toast-message";
import { COLORS } from "../../constants";
import axios from "axios";

const AddNewProduct = () => {
	const [quantity, setQuantity] = useState("");
	const [unit, setUnit] = useState("g");
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [calories, setCalories] = useState("");
	const [carbs, setCarbs] = useState("");
	const [fats, setFats] = useState("");
	const [protein, setProtein] = useState("");
	const [name, setSearchText] = useState("");
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [submitButtonColor, setSubmitButtonColor] = useState(COLORS.lightGray);
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	const unitList = [
		{ label: "Gram", value: "g" },
		{ label: "Miligram", value: "mg" },
		{ label: "Kilogram", value: "kg" },
		{ label: "Mililiter", value: "ml" },
		{ label: "Litre", value: "l" },
		{ label: "Ounce", value: "oz" },
		{ label: "Pound", value: "lb" },
		{ label: "Teaspoon", value: "tsp" },
		{ label: "Tablespoon", value: "tbsp" },
		{ label: "Cup", value: "cup" },
		{ label: "Pint", value: "pint" },
		{ label: "Quart", value: "quart" },
		{ label: "Gallon", value: "gallon" },
		{ label: "Unit", value: "unit" },
	];

	useEffect(() => {
		setIsSubmitDisabled(!name || !quantity);
	}, [name, quantity]);

	useEffect(() => {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (name.length > 0) {
			setSearchTimeout(
				setTimeout(() => {
					getSuggestions();
				}, 500)
			);
		} else {
			setSuggestions([]);
		}
	}, [name]);

	useEffect(() => {
		updateButtonColor();
	}, [name, unit, quantity]);

	const SuggestionItem = ({ suggestion, onPress }) => {
		return (
			<TouchableOpacity onPress={() => onPress(suggestion)} style={styles.suggestionItem}>
				<MaterialIcons name="fiber-manual-record" size={20} color={COLORS.primary} />
				<Text style={styles.suggestionText}>{suggestion.name}</Text>
			</TouchableOpacity>
		);
	};

	const getSuggestions = async () => {
		try {
			const response = await axios.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete", {
				params: {
					query: name,
					number: "8",
				},
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			});

			setSuggestions(response.data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const fetchProductImage = async (name) => {
		try {
			const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
				params: {
					search_terms: name,
					search_simple: 1,
					action: "process",
					json: 1,
				},
			});

			if (response.data && response.data.products && response.data.products.length > 0) {
				return response.data.products[0].image_url;
			}
		} catch (error) {
			console.error("Error fetching product image:", error);
		}

		return null;
	};

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const onChange = (event, selectedDate) => {
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const handleSearch = (isFocused) => {
		setShowSuggestions(isFocused);
	};

	const updateButtonColor = () => {
		if (name && unit && quantity) {
			setSubmitButtonColor(COLORS.primary);
		} else {
			setSubmitButtonColor(COLORS.gray2);
		}
	};

	const handleSuggestionPress = async (selectedSuggestion) => {
		setSearchText(selectedSuggestion.name);
		setShowSuggestions(false);

		const ingredientIdResponse = await axios({
			method: "GET",
			url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/search",
			params: {
				query: selectedSuggestion.name,
				metaInformation: "false",
				number: "1",
			},
			headers: {
				"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		});

		const ingredientId = ingredientIdResponse.data.results[0].id;

		const nutritionOptions = {
			method: "GET",
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${ingredientId}/information`,
			params: {
				amount: "100",
				unit: "grams",
			},
			headers: {
				"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};

		const nutritionResponse = await axios(nutritionOptions);

		// Extract nutritional values
		const caloriesObj = nutritionResponse.data.nutrition.nutrients.find((nutrient) => nutrient.name === "Calories");
		const carbsObj = nutritionResponse.data.nutrition.nutrients.find((nutrient) => nutrient.name === "Carbohydrates");
		const fatsObj = nutritionResponse.data.nutrition.nutrients.find((nutrient) => nutrient.name === "Fat");
		const proteinObj = nutritionResponse.data.nutrition.nutrients.find((nutrient) => nutrient.name === "Protein");

		// Update state variables
		setCalories(caloriesObj ? caloriesObj.amount.toString() : "");
		setCarbs(carbsObj ? carbsObj.amount.toString() : "");
		setFats(fatsObj ? fatsObj.amount.toString() : "");
		setProtein(proteinObj ? proteinObj.amount.toString() : "");
	};

	const checkRecipeExists = async (ingredient) => {
		try {
			const options = {
				method: "GET",
				url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
				params: {
					ingredients: ingredient,
					number: "1",
					ignorePantry: "false",
				},
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			};

			const response = await axios.request(options);
			return response.data.length > 0;
		} catch (error) {
			console.error("Error checking recipe:", error);
			return false;
		}
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			if (!name || !quantity) {
				alert("Please provide both name and quantity.");
				return;
			}

			const recipeExists = await checkRecipeExists(name);
			if (!recipeExists) {
				alert("Product name is not valid. Please try again");
				return;
			}

			const productImageURL = await fetchProductImage(name);
			const addedDate = new Date();
			const userId = firebase.auth().currentUser.uid;

			const userDocRef = firebase.firestore().collection("users").doc(userId);
			const userDoc = await userDocRef.get();
			const existingPantryItems = userDoc.data().pantryItems || [];

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const inputDate = new Date(date);
			inputDate.setHours(0, 0, 0, 0);

			const fiveDaysLater = new Date(today);
			fiveDaysLater.setDate(today.getDate() + 5);

			const dateTimestamp = firebase.firestore.Timestamp.fromDate(inputDate);

			console.log(productImageURL, name, quantity, dateTimestamp, unit, addedDate, calories, carbs, fats, protein);

			const newPantryItem = {
				pantryId: Date.now().toString(),
				productImageURL:
					productImageURL !== undefined
						? productImageURL
						: "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
				name: name !== undefined ? name : "",
				quantity: quantity !== undefined ? quantity.replace(",", ".") : "",
				date: dateTimestamp !== undefined ? dateTimestamp : "",
				unit: unit !== undefined ? unit : "",
				addedDate: addedDate !== undefined ? addedDate : "",
				calories: calories !== undefined ? calories : "",
				carbs: carbs !== undefined ? carbs : "",
				fats: fats !== undefined ? fats : "",
				protein: protein !== undefined ? protein : "",
				isExpired: false,
				isExpiringSoon: inputDate >= today && inputDate <= fiveDaysLater,
			};

			const updatedPantryItems = [...existingPantryItems, newPantryItem];

			await userDocRef.update({
				pantryItems: updatedPantryItems,
			});
			setLoading(false);
			console.log("Product added successfully");
			Toast.show({
				type: "success",
				text1: "Product created!",
				text2: "The product has been sucessfully added to your pantry.",
				visibilityTime: 4000,
				autoHide: true,
				topOffset: 60,
				bottomOffset: 40,
			});
		} catch (error) {
			console.error("Error adding product:", error);
			setLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<SafeAreaView style={styles.container}>
				{loading ? (
					<View style={styles.spinnerContainer}>
						<ActivityIndicator size="large" color={COLORS.primary} />
					</View>
				) : (
					<>
						<View style={styles.logoContainer}>
							<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
						</View>
						<Text style={styles.productNameLabel}>Product name</Text>
						<View style={styles.searchContainer}>
							<View style={styles.searchIconContainer}>
								<Ionicons name="search" size={20} color={COLORS.gray} />
							</View>
							<TextInput
								style={styles.searchInput}
								value={name}
								onChangeText={(text) => setSearchText(text)}
								placeholder="Search..."
								returnKeyType="search"
								onSubmitEditing={handleSearch}
								onFocus={() => handleSearch(true)}
								onBlur={() => handleSearch(false)}
							/>
						</View>
						{showSuggestions && (
							<View style={styles.suggestionsContainer}>
								{suggestions.map((suggestion) => (
									<SuggestionItem
										key={Math.random().toString()}
										suggestion={suggestion}
										onPress={() => handleSuggestionPress(suggestion)}
									/>
								))}
							</View>
						)}
						<View style={styles.nutritionLabelRow}>
							<View style={styles.inputLabelContainer}>
								<Text style={styles.inputLabel}>Quantity</Text>
							</View>
							<View style={styles.inputLabelContainerRight}>
								<Text style={styles.inputLabel}>Unit</Text>
							</View>
						</View>
						<View style={styles.inputRow}>
							<TextInput
								style={styles.quantityInput}
								value={quantity}
								onChangeText={(text) => setQuantity(text)}
								placeholder="Quantity"
								keyboardType="numeric"
							/>
							<View style={styles.unitInput}>
								<RNPickerSelect
									onValueChange={(value) => setUnit(value)}
									items={unitList}
									value={unit}
									style={{
										inputAndroid: styles.pickerStyle,
										inputIOS: styles.pickerStyle,
									}}
								/>
							</View>
						</View>
						<View style={styles.datePickerContainer}>
							<View style={styles.datePickerRow}>
								<Text style={styles.datePickerLabel}>Select product expiry date:</Text>
								<DateTimePicker
									value={date}
									mode="date"
									display="calendar"
									onChange={onChange}
									minimumDate={new Date()}
									style={styles.datePicker}
								/>
							</View>
						</View>
						<View style={styles.separatorContainer}>
							<View style={styles.line} />
							<Text style={styles.separatorText}>Nutrition (100g)</Text>
							<View style={styles.line} />
						</View>
						<View style={styles.nutritionLabelRow}>
							<View style={styles.inputLabelContainer}>
								<Text style={styles.inputLabel}>Calories (Kcal)</Text>
							</View>
							<View style={styles.inputLabelContainerRight}>
								<Text style={styles.inputLabel}>Carbs (g)</Text>
							</View>
						</View>
						<View style={styles.nutritionInputRow}>
							<TextInput
								style={styles.nutritionInput}
								value={calories}
								onChangeText={(text) => setCalories(text)}
								placeholder="Calories (Kcal)"
								keyboardType="numeric"
							/>
							<TextInput
								style={styles.nutritionInputRight}
								value={carbs}
								onChangeText={(text) => setCarbs(text)}
								placeholder="Carbs (g)"
								keyboardType="numeric"
							/>
						</View>
						<View style={styles.nutritionLabelRow}>
							<View style={styles.inputLabelContainer}>
								<Text style={styles.inputLabel}>Fats (g)</Text>
							</View>
							<View style={styles.inputLabelContainerRight}>
								<Text style={styles.inputLabel}>Protein (g)</Text>
							</View>
						</View>
						<View style={styles.nutritionInputRow}>
							<TextInput
								style={styles.nutritionInput}
								value={fats}
								onChangeText={(text) => setFats(text)}
								placeholder="Fats (g)"
								keyboardType="numeric"
							/>
							<TextInput
								style={styles.nutritionInputRight}
								value={protein}
								onChangeText={(text) => setProtein(text)}
								placeholder="Protein (g)"
								keyboardType="numeric"
							/>
						</View>
						<TouchableOpacity
							onPress={handleSubmit}
							disabled={isSubmitDisabled}
							style={{
								...styles.submitButton,
								backgroundColor: isSubmitDisabled ? COLORS.lightGray : COLORS.primary,
							}}>
							<Text style={styles.submitButtonText}>Submit</Text>
						</TouchableOpacity>
					</>
				)}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default AddNewProduct;
