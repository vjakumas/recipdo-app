import React from "react";
import { FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import ProductCardMedium from "./ProductCardMedium";
import styles from "./productCardMediumList.style";

const ProductCardMediumList = ({ products, onPress }) => {
	const renderItem = ({ item }) => <ProductCardMedium product={item} />;

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productList}>
			{products.map((product, index) => (
				<TouchableOpacity key={index} onPress={() => onPress(product)}>
					<ProductCardMedium product={product} />
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default ProductCardMediumList;
