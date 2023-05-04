import React, { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Modal,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import Toast from "react-native-toast-message";
import firebase, { firestore } from "../../config/firebase/config";
import styles from "./pantryDetails.style";
import { useNavigation } from "@react-navigation/native";

const PantryDetails = ({ route }) => {
	const { addedDate, date, isExpired, isExpiringSoon, name, pantryId, productImageURL, quantity, unit } = route.params;
	const carbs = route.params.carbs || "N/A";
	const fats = route.params.fats || "N/A";
	const protein = route.params.protein || "N/A";
	const calories = route.params.calories || "N/A";
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const navigation = useNavigation();

	const currentDate = new Date();
	const expirationDate = date && new Date(date.seconds * 1000);
	const daysDifference = expirationDate && Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

	const findRecipes = () => {
		// Implement logic to find recipes with this product
	};

	const removeProduct = async () => {
		try {
			const userId = firebase.auth().currentUser.uid;
			const userDocRef = firebase.firestore().collection("users").doc(userId);
			const userDoc = await userDocRef.get();
			const existingPantryItems = userDoc.data().pantryItems || [];

			const updatedPantryItems = existingPantryItems.filter((item) => item.pantryId !== pantryId);

			await userDocRef.update({
				pantryItems: updatedPantryItems,
			});

			Toast.show({
				type: "success",
				text1: "Product removed!",
				text2: "The product has been removed from your pantry.",
				visibilityTime: 4000,
				autoHide: true,
				topOffset: 60,
				bottomOffset: 40,
			});

			navigation.navigate("PantryList");
		} catch (error) {
			console.error("Error removing product:", error);
		}
	};

	const editProduct = () => {
		navigation.navigate("EditProduct", { pantryItem: route.params });
	};

	const textColor = () => {
		if (daysDifference <= 1) {
			return COLORS.error;
		} else if (daysDifference > 1 && daysDifference <= 5) {
			return COLORS.warning;
		} else {
			return COLORS.gray;
		}
	};

	const showModal = () => {
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Modal animationType="fade" transparent={true} visible={modalVisible}>
				<TouchableWithoutFeedback onPress={hideModal}>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>Remove Product</Text>
							<Text style={styles.modalText}>Are you sure you want to remove this product?</Text>
							<View style={styles.modalButtonsContainer}>
								<TouchableOpacity style={styles.modalCancelButton} onPress={hideModal}>
									<Text style={styles.modalCancelButtonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalConfirmButton}
									onPress={() => {
										removeProduct();
										hideModal();
									}}>
									<Text style={styles.modalConfirmButtonText}>Confirm</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: productImageURL }} />
					<TouchableOpacity style={styles.editButton} onPress={editProduct}>
						<MaterialIcons name="edit" size={24} color={COLORS.darkGray} />
					</TouchableOpacity>
				</View>
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
					</View>
					<View style={styles.unitHeader}>
						<Text style={styles.boldQuantity}>{quantity}</Text>
						<Text style={styles.grayText}>{unit}</Text>
					</View>
					<View style={styles.nutritionContainer}>
						<Text style={styles.nutritionTitle}>Nutrition Facts</Text>
						<View style={styles.nutritionRow}>
							<View style={styles.nutritionItem}>
								<View style={styles.nutritionIcon}>
									<MaterialIcons name="local-fire-department" size={24} color={COLORS.darkGray} />
								</View>
								<Text style={styles.nutritionText}>
									<Text style={styles.boldText}>{calories}</Text> Kcal
								</Text>
							</View>
							<View style={styles.nutritionItem}>
								<View style={styles.nutritionIcon}>
									<MaterialIcons name="free-breakfast" size={24} color={COLORS.darkGray} />
								</View>
								<Text style={styles.nutritionText}>
									<Text style={styles.boldText}>{carbs}</Text> carbs
								</Text>
							</View>
						</View>
						<View style={styles.nutritionRow}>
							<View style={styles.nutritionItem}>
								<View style={styles.nutritionIcon}>
									<MaterialIcons name="fitness-center" size={24} color={COLORS.darkGray} />
								</View>
								<Text style={styles.nutritionText}>
									<Text style={styles.boldText}>{protein}</Text> protein
								</Text>
							</View>
							<View style={styles.nutritionItem}>
								<View style={styles.nutritionIcon}>
									<MaterialIcons name="fastfood" size={24} color={COLORS.darkGray} />
								</View>
								<Text style={styles.nutritionText}>
									<Text style={styles.boldText}>{fats}</Text> fat
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.expirationDateContainer}>
						<View style={styles.dateAndIcon}>
							<Text style={styles.expirationDateTitle}>Expiration Date</Text>
						</View>
						<Text style={[styles.expirationDate, { color: textColor() }]}>{expirationDate && expirationDate.toLocaleDateString()}</Text>
					</View>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity style={styles.findRecipesButton} onPress={findRecipes}>
							<Text style={styles.findRecipesButtonText}>Find Recipes</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.removeProductButton} onPress={showModal}>
							<Text style={styles.removeProductButtonText}>Remove Product</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default PantryDetails;
