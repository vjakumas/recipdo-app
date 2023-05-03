import React from "react";
import { FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import ProductCardLarge from "./ProductCardLarge";
import styles from "./productCardLargeList.style";

const ProductCardLargeList = ({ products, onPress }) => {
	const renderItem = ({ item }) => <ProductCardLarge product={item} />;
	console.log({ products });

	return (
		<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productList}>
			<View style={styles.productGrid}>
				{products.map((product, index) => (
					<TouchableOpacity key={index} onPress={() => onPress(product)}>
						<ProductCardLarge product={product} />
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);
};

export default ProductCardLargeList;
