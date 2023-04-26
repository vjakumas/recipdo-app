import React from "react";
import { FlatList, View, ScrollView } from "react-native";
import ProductCardMedium from "./ProductCardMedium";
import styles from "./productCardMediumList.style";

const ProductCardMediumList = ({ products }) => {
	const renderItem = ({ item }) => <ProductCardMedium product={item} />;

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productList}>
			{products.map((product, index) => (
				<ProductCardMedium key={index} product={product} />
			))}
		</ScrollView>
	);
};

export default ProductCardMediumList;
