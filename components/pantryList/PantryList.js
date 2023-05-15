import React, { useState, useEffect } from "react";
import { View, TextInput, SafeAreaView, Image, Text, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./pantryList.style";
import { COLORS } from "../../constants";
import ProductCardMediumList from "../../components/common/cards/productCardMedium/ProductCardMediumList";
import ProductCardLargeList from "../../components/common/cards/productCardLarge/ProductCardLargeList";
import firebase from "../../config/firebase/config";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const PantryList = () => {
	const [searchText, setSearchText] = useState("");
	const [allProducts, setAllProducts] = useState([]);
	const [remainingProducts, setRemainingProducts] = useState([]);
	const [expiringSoonProducts, setExpiringSoonProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [productsLoading, setProductsLoading] = useState(true);
	const navigation = useNavigation();
	useEffect(() => {
		const user = firebase.auth().currentUser;
		if (user) {
			const unsubscribe = firebase
				.firestore()
				.collection("users")
				.doc(user.uid)
				.onSnapshot(async (doc) => {
					const pantryItems = doc.data().pantryItems;
					const expiringSoon = pantryItems
						.filter((product) => product.isExpiringSoon)
						.sort((a, b) => {
							const aDate = a.date?.toDate() || new Date();
							const bDate = b.date?.toDate() || new Date();
							return aDate - bDate;
						});
					const remaining = pantryItems.filter((product) => !product.isExpiringSoon);
					setExpiringSoonProducts(expiringSoon);
					setRemainingProducts(remaining);
					setAllProducts(pantryItems);

					await updateExpiringProducts(expiringSoon.length);

					setProductsLoading(false);
				});

			return () => {
				unsubscribe();
			};
		}
	}, []);

	useEffect(() => {
		if (searchText === "") {
			setFilteredProducts([]);
		} else {
			handleSearch();
		}
	}, [searchText]);

	const onProductPress = (product) => {
		navigation.navigate("PantryDetails", product);
	};

	const handleSearch = async () => {
		const searchResults = allProducts.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));
		setFilteredProducts(searchResults);
	};

	const updateExpiringProducts = async (expiringCount) => {
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.firestore().collection("users").doc(userId);

		await userRef.update({ expiringProducts: expiringCount });
	};

	const displayExpiringSoonProducts =
		filteredProducts.length > 0 ? filteredProducts.filter((product) => product.isExpiringSoon) : expiringSoonProducts;
	const displayRemainingProducts = filteredProducts.length > 0 ? filteredProducts.filter((product) => !product.isExpiringSoon) : remainingProducts;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} resizeMode="contain" />
			</View>
			{(expiringSoonProducts.length > 0 || remainingProducts.length > 0) && (
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
			)}

			{productsLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : expiringSoonProducts.length === 0 && remainingProducts.length === 0 ? (
				<View style={styles.noProductsContainer}>
					<Text style={styles.noProductsHeader}>Your pantry is waiting to be filled!</Text>
					<Text style={styles.noProductsTitle}>The possibilities are endless with a full pantry.</Text>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productList}>
					{displayExpiringSoonProducts.length > 0 ? (
						<>
							<Text style={styles.sectionTitle}>Expiring Soon</Text>
							<ProductCardMediumList products={displayExpiringSoonProducts} onPress={onProductPress} />
						</>
					) : null}
					{displayRemainingProducts.length > 0 ? (
						<>
							<Text style={styles.sectionTitle}>Remaining Products</Text>
							<ProductCardLargeList products={displayRemainingProducts} onPress={onProductPress} />
						</>
					) : null}
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default PantryList;
