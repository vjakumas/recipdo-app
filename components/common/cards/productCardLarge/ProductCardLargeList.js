import React from "react";
import { FlatList, View, ScrollView } from "react-native";
import ProductCardLarge from "./ProductCardLarge";
import styles from "./productCardLargeList.style";

const ProductCardLargeList = ({ products }) => {
	const renderItem = ({ item }) => <ProductCardLarge product={item} />;
	console.log({ products });

	return (
		<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productList}>
			<View style={styles.productGrid}>
				{products.map((product, index) => (
					<ProductCardLarge key={index} product={product} />
				))}
			</View>
		</ScrollView>
	);
};

export default ProductCardLargeList;
