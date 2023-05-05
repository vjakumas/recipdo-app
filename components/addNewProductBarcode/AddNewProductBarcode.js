import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import styles from "./addNewProductBarcode.style";
import axios from "axios";

const AddNewProductBarcode = () => {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const handleBarCodeScanned = async ({ data }) => {
		setScanned(true);
		console.log(data);
		const response = await axios.get(`https://world.openfoodfacts.org/api/v2/search?code=${data}.json`);
		console.log(response);
		const product = response.data.product;
		if (product) {
			// Display the product information on the screen
			// You can customize the UI as you want
			console.log("Product name:", product.product_name);
			console.log("Product type:", product.categories);
			console.log("Product quantity:", product.quantity);
			console.log("Product unit:", product.unit);
		} else {
			console.log("Product not found");
		}
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
			{scanned && (
				<Text onPress={() => setScanned(false)} style={styles.rescanText}>
					Tap here to scan again
				</Text>
			)}
		</View>
	);
};

export default AddNewProductBarcode;
