import React, { useState, useEffect, useCallback } from "react"; // Add useCallback import
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Image,
	FlatList,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./search.styles";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { fetchData, handleSearch } from "../../functions/SearchFunctions.js";
import RecipeCardLarge from "../../components/common/cards/recipeCardLarge/RecipeCardLarge.js";

// const RecipeCard = ({ recipe, onPress }) => {
// 	return (
// 		<TouchableOpacity onPress={onPress}>
// 			<View style={styles.recipeCard}>
// 				<View style={{ overflow: "hidden" }}>
// 					<Image source={{ uri: recipe.image }} style={styles.recipeImage} />
// 					<LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.overlay}>
// 						<Text style={styles.recipeType}>
// 							{recipe.dishTypes && recipe.dishTypes[0]
// 								? recipe.dishTypes[0].substring(0, 1).toUpperCase() + recipe.dishTypes[0].substring(1)
// 								: "Recipe"}
// 						</Text>
// 						<Text style={styles.recipeName}>{recipe.title}</Text>
// 					</LinearGradient>
// 					<View style={styles.infoBar}>
// 						<View style={styles.infoItem}>
// 							<View style={styles.greenDot} />
// 							<Text style={styles.infoText}>{recipe.extendedIngredients.length} Ingredients</Text>
// 						</View>
// 						<View style={styles.infoItem}>
// 							<Ionicons name="time-outline" size={16} color="white" />
// 							<Text style={styles.infoText}>{recipe.readyInMinutes} min</Text>
// 						</View>
// 					</View>
// 				</View>
// 			</View>
// 		</TouchableOpacity>
// 	);
// };

const Search = () => {
	const [searchText, setSearchText] = useState("");
	const [searchResultsId, setSearchResultsId] = useState([]);
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [searchType, setSearchType] = useState("Name");
	const [loading, setLoading] = useState(false);
	const [currentSearchText, setCurrentSearchText] = useState("");
	const [searchPerformed, setSearchPerformed] = useState(false);
	const navigation = useNavigation();
	const route = useRoute();

	useEffect(() => {
		if (route.params?.ingredient) {
			setSearchText(route.params.ingredient);
			setSearchType("Ingredients");
			setCurrentSearchText(route.params.ingredient);
			setLoading(true);
			fetchData(route.params.ingredient, searchType, setSearchResultsId, setSearchResultsData, setLoading);
		}
	}, [route]);

	const onRecipePress = (recipe) => {
		navigation.navigate("RecipeDetails", { recipe: recipe });
	};

	const dismissKeyboard = () => {
		Keyboard.dismiss();
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
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
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
						onSubmitEditing={() =>
							handleSearch(
								false,
								currentSearchText,
								searchText,
								setSearchPerformed,
								setLoading,
								searchType,
								setSearchResultsId,
								setSearchResultsData
							)
						}
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
				{loading ? (
					<ActivityIndicator size="large" style={{ marginTop: 225 }} color={COLORS.primary} />
				) : (
					<>
						{searchResultsData.length === 0 && searchPerformed && (
							<View style={styles.noResultsContainer}>
								<Text style={styles.noResultsLabel}>No results found.</Text>
								<Text style={styles.noResultsSublabel}>Try something different</Text>
							</View>
						)}
						{searchResultsData.length === 0 && !searchPerformed && (
							<View style={styles.noResultsContainer}>
								<Text style={styles.noResultsLabel}>Let's Get Cooking!</Text>
								<Text style={styles.noResultsSublabel}>Find delicious recipes for any occasion</Text>
							</View>
						)}
						<FlatList
							contentContainerStyle={styles.flatListContainer}
							data={searchResultsData}
							renderItem={({ item }) => (
								<View key={item.id}>
									<RecipeCardLarge recipe={item} onRecipePress={onRecipePress} />
								</View>
							)}
							keyExtractor={(item) => item.id.toString()}
						/>
					</>
				)}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default Search;
