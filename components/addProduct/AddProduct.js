import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./addProduct.style";
import { COLORS } from "../../constants";

const AddProduct = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<Image source={require("../../assets/images/add-product-illustration.png")} style={styles.logo} />
				<Text style={styles.mainHeader}>Add a new product</Text>
				<Text style={styles.subText}>Expand your cooking horizons with a new ingredient!</Text>
			</View>
			<View style={styles.bottomContainer}>
				<TouchableOpacity onPress={() => navigation.navigate("AddNewProduct")} style={styles.primaryButton}>
					<View style={styles.buttonContent}>
						<Icon name="add-circle" size={24} style={{ marginRight: 10, color: COLORS.white }} />
						<Text style={styles.primaryButtonText}>Add new product</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.separatorContainer}>
					<View style={styles.line} />
					<Text style={styles.separatorText}>Or continue with</Text>
					<View style={styles.line} />
				</View>
				<TouchableOpacity onPress={() => console.log("Scan a product")} style={styles.secondaryButton}>
					<View style={styles.buttonContent}>
						<Icon name="scan" size={24} style={{ marginRight: 10, color: COLORS.darkGray }} />
						<Text style={styles.secondaryButtonText}>Scan a product</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("AddNewProductBarcode")} style={styles.secondaryButton}>
					<View style={styles.buttonContent}>
						<Icon name="barcode" size={24} style={{ marginRight: 10, color: COLORS.darkGray }} />
						<Text style={styles.secondaryButtonText}>Scan a barcode</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default AddProduct;
