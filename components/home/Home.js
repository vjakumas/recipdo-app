import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import firebase from "../../config/firebase/config";
import styles from "./home.style";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RecipeCardMediumList from "../common/cards/recipeCardMedium/RecipeCardMediumList";
import ProfileDropdown from "../common/dropdown/profileDropdown/ProfileDropdown";

const Home = () => {
	const [name, setName] = useState("");
	const navigation = useNavigation();

	useEffect(() => {
		firebase
			.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setName(snapshot.data());
					console.log(name);
				} else {
					console.log("User does not exist");
				}
			});
	}, []);

	const profileDropdownRef = useRef(null);

	const toggleDropdown = () => {
		if (profileDropdownRef.current) {
			profileDropdownRef.current.toggleDropdown();
		}
	};

	const handleLogout = () => {
		toggleDropdown();
		firebase
			.auth()
			.signOut()
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: "Auth" }],
				});
			});
	};

	const handleSettings = () => {
		toggleDropdown();
		navigation.navigate("Settings");
	};

	const handleStatistics = () => {
		toggleDropdown();
		navigation.navigate("Statistics");
	};

	const sampleRecipes = [
		{
			id: 1,
			image: "https://source.unsplash.com/random/?food",
			type: "Dinner",
			name: "Delicious Recipe",
			cookingTime: 30,
			ingredientsCount: 10,
		},
		{
			id: 2,
			image: "https://source.unsplash.com/random/?pizza",
			type: "Lunch",
			name: "Tasty Pizza",
			cookingTime: 20,
			ingredientsCount: 8,
		},
		{
			id: 3,
			image: "https://source.unsplash.com/random/?pasta",
			type: "Breakfast",
			name: "Pasta mamamia",
			cookingTime: 15,
			ingredientsCount: 8,
		},
		{
			id: 4,
			image: "https://source.unsplash.com/random/?burger",
			type: "Dinner",
			name: "Juicy Burger",
			cookingTime: 25,
			ingredientsCount: 6,
		},
		{
			id: 5,
			image: "https://source.unsplash.com/random/?dessert",
			type: "Dessert",
			name: "Sweet Treat",
			cookingTime: 10,
			ingredientsCount: 5,
		},
		{
			id: 6,
			image: "https://source.unsplash.com/random/?tacos",
			type: "Lunch",
			name: "Taco Tuesday",
			cookingTime: 30,
			ingredientsCount: 7,
		},
		{
			id: 7,
			image: "https://source.unsplash.com/random/?salad",
			type: "Lunch",
			name: "Fresh Salad",
			cookingTime: 15,
			ingredientsCount: 6,
		},
		{
			id: 8,
			image: "https://source.unsplash.com/random/?soup",
			type: "Dinner",
			name: "Hearty Soup",
			cookingTime: 45,
			ingredientsCount: 10,
		},
		{
			id: 9,
			image: "https://source.unsplash.com/random/?bbq",
			type: "Dinner",
			name: "BBQ Ribs",
			cookingTime: 60,
			ingredientsCount: 8,
		},
		{
			id: 10,
			image: "https://source.unsplash.com/random/?seafood",
			type: "Dinner",
			name: "Seafood Feast",
			cookingTime: 40,
			ingredientsCount: 12,
		},
	];

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.topBar}>
					<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
					<View style={styles.rightIcons}>
						<Ionicons name="notifications-outline" size={24} color={COLORS.darkGray} style={styles.notificationIcon} />
						<ProfileDropdown
							ref={profileDropdownRef}
							handleSettings={handleSettings}
							handleLogout={handleLogout}
							handleStatistics={handleStatistics}
						/>
					</View>
				</View>
				<View style={styles.recipesContainer}>
					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Recommended for you</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Save-the-food recipes</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Time saving recipes</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Make it again</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
