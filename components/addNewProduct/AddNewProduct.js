import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Keyboard } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./addNewProduct.style";
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
	const [searchText, setSearchText] = useState("");
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

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
	];

	useEffect(() => {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (searchText.length > 0) {
			setSearchTimeout(
				setTimeout(() => {
					getSuggestions();
				}, 500)
			);
		} else {
			setSuggestions([]);
		}
	}, [searchText]);

	const SuggestionItem = ({ suggestion, onPress }) => {
		return (
			<TouchableOpacity onPress={() => onPress(suggestion)}>
				<Text style={styles.suggestionItem}>{suggestion.name}</Text>
			</TouchableOpacity>
		);
	};

	const getSuggestions = async () => {
		try {
			const response = await axios.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete", {
				params: {
					query: searchText,
					number: "8",
				},
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			});

			setSuggestions(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const onChange = (event, selectedDate) => {
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const handleSearch = (isFocused) => {
		setShowSuggestions(isFocused);
	};

	const handleSubmit = () => {
		// Handle submission logic here
		setSubmitButtonPressed(true);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
			</View>
			<View style={styles.searchContainer}>
				<View style={styles.searchIconContainer}>
					<Ionicons name="search" size={20} color={COLORS.gray} />
				</View>
				<TextInput
					style={styles.searchInput}
					value={searchText}
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
							key={suggestion.id}
							suggestion={suggestion}
							onPress={(selectedSuggestion) => {
								setSearchText(selectedSuggestion.name);
								setShowSuggestions(false);
							}}
						/>
					))}
				</View>
			)}
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
						display="default"
						onChange={onChange}
						minimumDate={new Date()}
						style={styles.datePicker}
					/>
				</View>
			</View>
			<View style={styles.separatorContainer}>
				<View style={styles.line} />
				<Text style={styles.separatorText}>Nutrition</Text>
				<View style={styles.line} />
			</View>
			<View style={styles.nutritionInputRow}>
				<TextInput
					style={styles.nutritionInput}
					value={calories}
					onChangeText={(text) => setCalories(text)}
					placeholder="Calories"
					keyboardType="numeric"
				/>
				<TextInput
					style={styles.nutritionInput}
					value={carbs}
					onChangeText={(text) => setCarbs(text)}
					placeholder="Carbs"
					keyboardType="numeric"
				/>
			</View>
			<View style={styles.nutritionInputRow}>
				<TextInput
					style={styles.nutritionInput}
					value={fats}
					onChangeText={(text) => setFats(text)}
					placeholder="Fats"
					keyboardType="numeric"
				/>
				<TextInput
					style={styles.nutritionInput}
					value={protein}
					onChangeText={(text) => setProtein(text)}
					placeholder="Protein"
					keyboardType="numeric"
				/>
			</View>
			<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>Submit</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default AddNewProduct;
