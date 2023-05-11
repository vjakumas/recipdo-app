import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./recipeCardLarge.style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const RecipeCardLarge = ({ recipe }) => {
	const navigation = useNavigation();

	const onRecipePress = () => {
		navigation.navigate("RecipeDetails", { recipe });
	};

	return (
		<TouchableOpacity onPress={() => onRecipePress(recipe)}>
			<View style={styles.recipeCard}>
				<View style={{ overflow: "hidden" }}>
					<Image source={{ uri: recipe.image }} style={styles.recipeImage} />
					<LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.overlay}>
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
							<Text style={styles.infoText}>{(recipe?.extendedIngredients?.length ?? 0).toString()} Ingredients</Text>
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="time-outline" size={16} color="white" />
							<Text style={styles.infoText}>{(recipe?.readyInMinutes ?? 0).toString()} min</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default RecipeCardLarge;
