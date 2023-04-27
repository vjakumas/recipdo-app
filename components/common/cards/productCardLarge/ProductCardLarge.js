import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./productCardLarge.style";
import { COLORS } from "../../../../constants";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProductCardLarge = ({ product }) => {
	const expiryDate = product.date?.toDate() || new Date();
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).format(expiryDate);

	return (
		<View style={styles.card}>
			<View style={{ overflow: "hidden" }}>
				<Image source={{ uri: product.productImageURL }} style={styles.image} />
				<LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient} />
				<View style={styles.textOverlay}>
					<Text style={styles.overlayText}>
						{product.searchText ? product.searchText.charAt(0).toUpperCase() + product.searchText.slice(1) : ""}
					</Text>
				</View>
			</View>
			<View style={styles.infoBar}>
				<View style={styles.infoItem}>
					<MaterialCommunityIcons name="weight" size={16} color={COLORS.lightGray} />
					<Text style={styles.infoText}>
						{product.quantity} {product.unit}
					</Text>
				</View>
				<View style={styles.infoItem}>
					<MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.lightGray} />
					<Text style={styles.infoText}>{formattedDate}</Text>
				</View>
			</View>
		</View>
	);
};

export default ProductCardLarge;
