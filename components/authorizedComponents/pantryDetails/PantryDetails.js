import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants";
import Toast from "react-native-toast-message";
import styles from "./pantryDetails.style";
import { useNavigation } from "@react-navigation/native";
import { removeProduct } from "../../../functions/ProductFunctions";

const PantryDetails = ({ route }) => {
	const { date, name, pantryId, productImageURL, quantity, unit } = route.params;
	const carbs = route.params.carbs || "N/A";
	const fats = route.params.fats || "N/A";
	const protein = route.params.protein || "N/A";
	const calories = route.params.calories || "N/A";
	const [modalVisible, setModalVisible] = useState(false);
	const [reason, setReason] = useState("");

	const navigation = useNavigation();

	const currentDate = new Date();
	const expirationDate = date && new Date(date.seconds * 1000);
	const daysDifference = expirationDate && Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

	const findRecipes = () => {
		navigation.navigate("SearchScreen", { ingredient: name });
	};

	const handleReasonChange = (newReason) => {
		setReason(newReason);
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
							<Text style={styles.modalText}>Please the reason why are you removing the product</Text>

							<View style={styles.checkboxesContainer}>
								<View style={styles.checkboxContainer}>
									<TouchableOpacity
										onPress={() => handleReasonChange("Expired")}
										style={[styles.checkbox, reason === "Expired" ? styles.checkboxSelected : {}]}>
										{reason === "Expired" && <Text style={styles.checkboxIcon}>✓</Text>}
									</TouchableOpacity>
									<Text style={[styles.checkboxLabel, reason === "Expired" ? styles.checkboxLabelSelected : {}]}>Expired</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<TouchableOpacity
										onPress={() => handleReasonChange("Gave Away")}
										style={[styles.checkbox, reason === "Gave Away" ? styles.checkboxSelected : {}]}>
										{reason === "Gave Away" && <Text style={styles.checkboxIcon}>✓</Text>}
									</TouchableOpacity>
									<Text style={[styles.checkboxLabel, reason === "Gave Away" ? styles.checkboxLabelSelected : {}]}>Gave Away</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<TouchableOpacity
										onPress={() => handleReasonChange("Already consumed")}
										style={[styles.checkbox, reason === "Already consumed" ? styles.checkboxSelected : {}]}>
										{reason === "Already consumed" && <Text style={styles.checkboxIcon}>✓</Text>}
									</TouchableOpacity>
									<Text style={[styles.checkboxLabel, reason === "Already consumed" ? styles.checkboxLabelSelected : {}]}>
										Already consumed
									</Text>
								</View>
								<View style={styles.checkboxContainer}>
									<TouchableOpacity
										onPress={() => handleReasonChange("Other")}
										style={[styles.checkbox, reason === "Other" ? styles.checkboxSelected : {}]}>
										{reason === "Other" && <Text style={styles.checkboxIcon}>✓</Text>}
									</TouchableOpacity>
									<Text style={[styles.checkboxLabel, reason === "Other" ? styles.checkboxLabelSelected : {}]}>Other</Text>
								</View>
							</View>

							<View style={styles.modalButtonsContainer}>
								<TouchableOpacity style={styles.modalCancelButton} onPress={hideModal}>
									<Text style={styles.modalCancelButtonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalConfirmButton}
									onPress={() => {
										removeProduct(reason, pantryId, navigation, Toast);
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
