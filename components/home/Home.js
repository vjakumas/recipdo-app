import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator, RefreshControl } from "react-native";
import firebase from "../../config/firebase/config";
import styles from "./home.style";
import { COLORS } from "../../constants/theme";
import RecipeCardMediumList from "../common/cards/recipeCardMedium/RecipeCardMediumList";
import RecipeCardMediumSafeFoodList from "../common/cards/recipeCardMediumSafeFood/RecipeCardMediumSafeFoodList";
import ProfileDropdown from "../common/dropdown/profileDropdown/ProfileDropdown";
import { fetchUserData } from "../../functions/UserFunctions";
import { fetchRecommendedRecipes, fetchSaveTheFoodRecipes, fetchMakeItAgainRecipes } from "../../functions/RecipeFunctions";

const Home = ({ navigation }) => {
	const [userData, setUserData] = useState(null);
	const [recommendedRecipes, setRecommendedRecipes] = useState([]);
	const [saveTheFoodRecipes, setSaveTheFoodRecipes] = useState([]);
	const [makeItAgainRecipes, setMakeItAgainRecipes] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUserData().then((data) => {
			setUserData(data);
		});
		updateExpiringItems();

		// COMMENT/UNCOMMENT THIS LINE TO FETCH RECIPES
		//setLoading(false);

		// UNCOMMENT/COMMENT THIS CODE TO FETCH RECIPES
		Promise.all([fetchRecommendedRecipes(), fetchSaveTheFoodRecipes(), fetchMakeItAgainRecipes()]).then((values) => {
			setRecommendedRecipes(values[0]);
			setSaveTheFoodRecipes(values[1]);
			setMakeItAgainRecipes(values[2]);
			setLoading(false);
		});
	}, []);

	const handleRefresh = async () => {
		setRefreshing(true);

		// UNCOMMENT/COMMENT THIS CODE TO FETCH RECIPES
		Promise.all([fetchRecommendedRecipes(), fetchSaveTheFoodRecipes(), fetchMakeItAgainRecipes()]).then((values) => {
			setRecommendedRecipes(values[0]);
			setSaveTheFoodRecipes(values[1]);
			setMakeItAgainRecipes(values[2]);
			setLoading(false);
		});
		setRefreshing(false);
	};

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

			const updatedPantryItems = pantryItems.map((item) => {
				const itemDate = item.date.toDate();
				if (itemDate > today && itemDate <= fiveDaysLater && !item.isExpiringSoon) {
					return { ...item, isExpiringSoon: true };
				}
				return item;
			});

			const expiringProductsCount = updatedPantryItems.filter((item) => item.isExpiringSoon).length;

			await userRef.update({ pantryItems: updatedPantryItems });
			await userRef.update({ productsLastCheckDate: firebase.firestore.Timestamp.fromDate(new Date()) });
			await userRef.update({ expiringProducts: expiringProductsCount });
			await removeExpiredItems();
		}
	};

	const removeExpiredItems = async () => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.firestore().collection("users").doc(userId);

		const userData = await userRef.get();
		const pantryItems = userData.data().pantryItems;
		const today = new Date();

		let expiredProductsCount = 0;

		const nonExpiredPantryItems = pantryItems.filter((item) => {
			const itemDate = item.date.toDate();
			if (itemDate < today) {
				expiredProductsCount++;
				return false;
			}
			return true;
		});

		await userRef.update({ pantryItems: nonExpiredPantryItems });
		await userRef.update({ expiredProducts: firebase.firestore.FieldValue.increment(expiredProductsCount) });
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

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} />
				<View style={styles.rightIcons}>
					<ProfileDropdown
						ref={profileDropdownRef}
						handleSettings={handleSettings}
						handleLogout={handleLogout}
						handleStatistics={handleStatistics}
					/>
				</View>
			</View>
			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}>
					<View style={styles.recipesContainer}>
						<View style={styles.categorySectionSaveTheFood}>
							<View style={styles.categoryHeaderSaveTheFood}>
								<Text style={styles.categoryTitleSaveTheFood}>Save-the-food recipes</Text>
							</View>
							<RecipeCardMediumSafeFoodList recipes={saveTheFoodRecipes} navigation={navigation} />
						</View>
						<View style={styles.categorySection}>
							<View style={styles.categoryHeader}>
								<Text style={styles.categoryTitle}>Recommended for you</Text>
							</View>
							<RecipeCardMediumList recipes={recommendedRecipes} navigation={navigation} />
						</View>

						<View style={styles.categorySection}>
							<View style={styles.categoryHeader}>
								<Text style={styles.categoryTitle}>Make it again</Text>
							</View>
							<RecipeCardMediumList recipes={makeItAgainRecipes} navigation={navigation} />
						</View>
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default Home;
