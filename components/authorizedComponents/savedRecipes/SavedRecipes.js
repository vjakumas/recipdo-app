import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import styles from "./savedRecipes.style";
import { SIZES, COLORS, FONT } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { fetchSavedRecipes } from "../../../functions/RecipeFunctions";

const SavedRecipes = () => {
	const [recipes, setRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		fetchSavedRecipes(setRecipes, setIsLoading);
	}, []);

	const handleRefresh = async () => {
		setRefreshing(true);
		fetchSavedRecipes(setRecipes, setIsLoading);
		setRefreshing(false);
	};

	const onRecipePress = (recipe) => {
		navigation.navigate("RecipeDetails", { recipe });
	};

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<View style={styles.logoContainer}>
					<Image source={require("../../../assets/images/logo-black-green.png")} style={styles.logo} />
				</View>
				<ActivityIndicator size="large" color={COLORS.primary} />
				<Text style={{ marginTop: SIZES.small, fontFamily: FONT.semiBold, color: COLORS.gray }}>Loading your favourite recipes...</Text>
			</View>
		);
	}

	const RecipeCard = ({ recipe, onPress }) => {
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={styles.recipeCard}>
					<View style={{ overflow: "hidden" }}>
						<Image source={{ uri: recipe.image }} style={styles.recipeImage} />
						<LinearGradient
							colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={styles.overlay}>
							<Text style={styles.recipeType}>
								{recipe.dishTypes && recipe.dishTypes[0]
									? recipe.dishTypes[0].substring(0, 1).toUpperCase() + recipe.dishTypes[0].substring(1)
									: "Recipe"}
							</Text>
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
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<View style={styles.logoContainer}>
				<Image source={require("../../../assets/images/logo-black-green.png")} style={styles.logo} />
			</View>
			<View style={{ flex: 1 }}>
				{recipes.length > 0 && (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingHorizontal: SIZES.medium,
							marginTop: SIZES.medium,
							marginBottom: SIZES.small,
						}}>
						<Text style={styles.titleText}>Saved Recipes</Text>
						<Text style={styles.totalText}>{recipes.length} Results</Text>
					</View>
				)}
				{recipes.length > 0 ? (
					<FlatList
						data={recipes}
						renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => onRecipePress(item)} />}
						keyExtractor={(item) => item.id.toString()}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: SIZES.medium }}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
					/>
				) : (
					<View style={styles.noProductsContainer}>
						<Text style={styles.noProductsHeader}>Your Recipe Collection is Empty!</Text>
						<Text style={styles.noProductsTitle}>Save recipes for easy access later!</Text>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};

export default SavedRecipes;
