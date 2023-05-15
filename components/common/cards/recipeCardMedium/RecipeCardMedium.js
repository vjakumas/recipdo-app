import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./recipeCardMedium.style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RecipeCardMedium = ({ recipe, navigation }) => {
	const handleRecipePress = () => {
		navigation.navigate("RecipeDetails", { recipe });
	};

	return (
		<TouchableOpacity onPress={handleRecipePress}>
			<View style={styles.card}>
				<View style={{ overflow: "hidden" }}>
					<Image source={{ uri: recipe.image }} style={styles.image} />
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
							<Text style={styles.infoText}>
								{recipe?.extendedIngredients.length ? recipe?.extendedIngredients.length : "N/A"} Ingredients
							</Text>
						</View>
						<View style={styles.infoItem}>
							<MaterialCommunityIcons name="clock-outline" size={16} color="white" />
							<Text style={styles.infoText}>{recipe.readyInMinutes} min</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default RecipeCardMedium;
