import React, { useState, useEffect } from "react";
import { View, TextInput, SafeAreaView, Image, TouchableOpacity, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./pantryList.style";
import { COLORS } from "../../constants";
import ProductCardMediumList from "../../components/common/cards/productCardMedium/ProductCardMediumList";
import ProductCardLarge from "../../components/common/cards/productCardLarge/ProductCardLarge";
import ProductCardLargeList from "../../components/common/cards/productCardLarge/ProductCardLargeList";
import firebase from "../../config/firebase/config";
import { ScrollView } from "react-native-gesture-handler";

const PantryList = () => {
	const [searchText, setSearchText] = useState("");
	const [allProducts, setAllProducts] = useState([]);
	const [remainingProducts, setRemainingProducts] = useState([]);
	const [expiringSoonProducts, setExpiringSoonProducts] = useState([]);

	useEffect(() => {
		const user = firebase.auth().currentUser;
		if (user) {
			const unsubscribe = firebase
				.firestore()
				.collection("users")
				.doc(user.uid)
				.onSnapshot((doc) => {
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
				});

			return () => {
				unsubscribe();
			};
		}
	}, []);

	const handleSearch = async () => {
		console.log("search!");
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
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productList}>
				<Text style={styles.sectionTitle}>Expiring Soon</Text>
				<ProductCardMediumList products={expiringSoonProducts} />
				<Text style={styles.sectionTitle}>Remaining Products</Text>
				<ProductCardLargeList products={remainingProducts} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default PantryList;
