import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, FlatList, ActivityIndicator } from "react-native";
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
					<Text style={styles.recipeType}>{recipe.dishTypes[0].substring(0, 1).toUpperCase() + recipe.dishTypes[0].substring(1)}</Text>
					<Text style={styles.recipeName}>{recipe.title}</Text>
				</LinearGradient>
				<View style={styles.infoBar}>
					<View style={styles.infoItem}>
						<View style={styles.greenDot} />
						<Text style={styles.infoText}>{recipe.extendedIngredients.length} Ingredients</Text>
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
	const [searchResultsId, setSearchResultsId] = useState([]);
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [searchType, setSearchType] = useState("Name");
	const [loading, setLoading] = useState(false);

	const handleSearch = async () => {
		if (!searchText) {
			setSearchResultsId([]);
			return;
		}

		setLoading(true);

		let url = "";
		let options = {};
		if (searchType === "Name") {
			url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex";
			options = {
				method: "GET",
				url: url,
				params: {
					query: searchText,
					number: "10",
				},
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			};
		} else {
			url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients";
			options = {
				method: "GET",
				url: url,
				params: {
					ingredients: searchText,
					number: "10",
				},
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			};
		}

		try {
			const searchResponse = await axios.request(options);

			const recipeIds = (searchResponse.data.results || searchResponse.data).map((recipe) => recipe.id).join(",");

			const recipeInfoOptions = {
				method: "GET",
				url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
				params: { ids: recipeIds },
				headers: {
					"content-type": "application/octet-stream",
					"X-RapidAPI-Key": "cf5c25b71bmsh88d9f572c64eb2ep1f4ac9jsn06f2d083bd96",
					"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
				},
			};

			const [, recipeInfoResponse] = await Promise.all([Promise.resolve(searchResponse), axios.request(recipeInfoOptions)]);

			setSearchResultsId(searchResponse.data.results || searchResponse.data);
			setSearchResultsData(recipeInfoResponse.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setSearchResultsId([]);
			setSearchResultsData([]);
			setLoading(false);
		}
	};

	const renderSearchTypeButton = (type) => {
		const isSelected = searchType === type;

		return (
			<TouchableOpacity
				onPress={() => setSearchType(type)}
				style={[styles.searchTypeButton, isSelected && styles.searchTypeButtonSelected, type === "Name" && styles.buttonMargin]}>
				<Text style={[styles.searchTypeText, isSelected && styles.searchTypeTextSelected]}>{type}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} resizeMode="contain" />
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
				/>
			</View>
			<View style={styles.buttonsContainer}>
				{renderSearchTypeButton("Name")}
				{renderSearchTypeButton("Ingredients")}
			</View>
			{searchResultsData.length > 0 && (
				<View>
					<Text style={styles.searchResultsHeading}>Search Results</Text>
				</View>
			)}
			{loading ? ( // Add this conditional rendering
				<ActivityIndicator size="large" style={{ marginTop: 225 }} color={COLORS.primary} />
			) : (
				<>
					{searchResultsData.length === 0 && (
						<View style={styles.noResultsContainer}>
							<Text style={styles.noResultsLabel}>Let's Get Cooking!</Text>
							<Text style={styles.noResultsSublabel}>Find delicious recipes for any occasion</Text>
						</View>
					)}
					<FlatList
						contentContainerStyle={styles.flatListContainer} // Add this line
						data={searchResultsData}
						renderItem={({ item }) => (
							<View key={item.id}>
								<RecipeCard recipe={item} />
							</View>
						)}
						keyExtractor={(item) => item.id.toString()}
					/>
				</>
			)}
		</SafeAreaView>
	);
};

export default Search;
