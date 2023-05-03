import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import firebase from "../../config/firebase/config";
import styles from "./home.style";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RecipeCardMediumList from "../common/cards/recipeCardMedium/RecipeCardMediumList";
import ProfileDropdown from "../common/dropdown/profileDropdown/ProfileDropdown";

const Home = ({ navigation }) => {
	const [name, setName] = useState("");

	useEffect(() => {
		firebase
			.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setName(snapshot.data());
				} else {
					console.log("User does not exist");
				}
			});
		updateExpiringItems();
	}, []);

	const profileDropdownRef = useRef(null);

	const toggleDropdown = () => {
		if (profileDropdownRef.current) {
			profileDropdownRef.current.toggleDropdown();
		}
	};

	const isDateInPast = (date1, date2) => {
		const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
		const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
		return d1 < d2;
	};

	const updateExpiringItems = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.firestore().collection("users").doc(userId);

		const userData = await userRef.get();
		const productsLastCheckDate = userData.data().productsLastCheckDate.toDate();
		const today = new Date();
		const fiveDaysLater = new Date(today);
		fiveDaysLater.setDate(today.getDate() + 5);

		if (isDateInPast(productsLastCheckDate, today)) {
			const pantryItems = userData.data().pantryItems;
			console.log("Pantry items:", pantryItems);

			const todayTimestamp = firebase.firestore.Timestamp.fromDate(today);
			const fiveDaysLaterTimestamp = firebase.firestore.Timestamp.fromDate(fiveDaysLater);

			const updatedPantryItems = pantryItems.map((item) => {
				const itemDate = item.date.toDate();
				if (itemDate > today && todayTimestamp <= fiveDaysLaterTimestamp && !item.isExpiringSoon) {
					return { ...item, isExpiringSoon: true };
				}
				return item;
			});

			await userRef.update({ pantryItems: updatedPantryItems });
			await userRef.update({ productsLastCheckDate: firebase.firestore.Timestamp.fromDate(new Date()) });
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
	];

	return (
		<SafeAreaView style={styles.container}>
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
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.recipesContainer}>
					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Recommended for you</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} navigation={navigation} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Save-the-food recipes</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} navigation={navigation} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Time saving recipes</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} navigation={navigation} />
					</View>

					<View style={styles.categorySection}>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryTitle}>Make it again</Text>
							<TouchableOpacity style={styles.seeAllButton}>
								<Text style={styles.seeAllText}>See all</Text>
							</TouchableOpacity>
						</View>
						<RecipeCardMediumList recipes={sampleRecipes} navigation={navigation} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
