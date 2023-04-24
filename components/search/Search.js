import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./search.styles";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const RecipeCard = ({ recipe }) => {
	return (
		<View style={styles.recipeCard}>
			<View style={{ overflow: "hidden" }}>
				<Image source={{ uri: recipe.image }} style={styles.recipeImage} />
				<LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.overlay}>
					<Text style={styles.recipeType}>Type: {recipe.type}</Text>
					<Text style={styles.recipeName}>{recipe.title}</Text>
				</LinearGradient>
				<View style={styles.infoBar}>
					<View style={styles.infoItem}>
						<View style={styles.greenDot} />
						<Text style={styles.infoText}>{recipe.ingredientsCount} Ingredients</Text>
					</View>
					<View style={styles.infoItem}>
						<Ionicons name="time-outline" size={16} color="white" />
						<Text style={styles.infoText}>{recipe.readyInMinutes} min</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

const Search = () => {
	const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchType, setSearchType] = useState("name");

	const handleSearch = async () => {
		if (!searchText) {
			setSearchResults([]);
			return;
		}

		let url = "";
		if (searchType === "name") {
			url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch";
		} else {
			url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients";
		}

		const options = {
			method: "GET",
			url: url,
			params: {
				query: searchText,
				ingredients: searchText,
				number: "10",
			},
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};

		try {
			const response = await axios.request(options);
			setSearchResults(response.data.results || response.data);
		} catch (error) {
			console.error(error);
			setSearchResults([]);
		}
	};

	const renderSearchTypeButton = (type) => {
		const isSelected = searchType === type;

		return (
			<TouchableOpacity onPress={() => setSearchType(type)} style={[styles.searchTypeButton, isSelected && styles.searchTypeButtonSelected]}>
				<Text style={[styles.searchTypeText, isSelected && styles.searchTypeTextSelected]}>{type}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} resizeMode="contain" />
			</View>
			<View style={styles.searchBarContainer}>
				<TextInput
					style={styles.searchInput}
					value={searchText}
					onChangeText={(text) => setSearchText(text)}
					placeholder="Search..."
					returnKeyType="search"
					onSubmitEditing={handleSearch}
				/>
				<View style={styles.searchTypeContainer}>
					{renderSearchTypeButton("Name")}
					{renderSearchTypeButton("Ingredient")}
				</View>
			</View>
			<Text style={styles.searchResultsHeading}>Search Results</Text>
			<FlatList
				data={searchResults}
				renderItem={({ item }) => <RecipeCard key={item.idMeal} recipe={item} />}
				keyExtractor={(item) => item.idMeal}
			/>
		</SafeAreaView>
	);
};

export default Search;
