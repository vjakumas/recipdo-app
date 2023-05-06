import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Image,
	FlatList,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./search.styles";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const Search = () => {
	return (
		<View>
			<Text>Search</Text>
		</View>
	);
};

export default Search;
