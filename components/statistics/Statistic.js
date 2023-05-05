import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Image, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants";
import { PieChart } from "react-native-svg-charts";
import { Circle, G, Line, Text as SvgText } from "react-native-svg";
import firebase, { firestore } from "../../config/firebase/config";
import styles from "./statistic.style";

const Statistic = () => {
	const [userData, setUserData] = useState({
		consumedProducts: 0,
		expiringProducts: 0,
		expiredProducts: 0,
		finishedRecipes: [],
		consumedProductsList: [],
		pantryItems: [],
		savedRecipes: [],
	});
	const [topConsumedProducts, setTopConsumedProducts] = useState([]);
	const [topFavoriteRecipes, setTopFavoriteRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const userId = firebase.auth().currentUser.uid;
			try {
				const docRef = firebase.firestore().collection("users").doc(userId);
				const doc = await docRef.get();
				if (doc.exists) {
					setUserData(doc.data());
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.log("Error getting document:", error);
			}
		};

		fetchData();

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		setTopConsumedProducts(getTopConsumedProducts(userData.consumedProductsList));
		setTopFavoriteRecipes(getTopFavoriteRecipes(userData.finishedRecipes));
	}, [userData]);

	const renderPieLabel = ({ slices, height, width }) => {
		console.log("Rendering pie labels");
		return slices.map((slice, index) => {
			const { labelCentroid, pieCentroid, data } = slice;
			const textLabel = data.amount + " (" + data.key + ")";
			return (
				<G key={index}>
					<Line x1={labelCentroid[0]} y1={labelCentroid[1]} x2={pieCentroid[0]} y2={pieCentroid[1]} stroke={data.svg.fill} />
					<Circle cx={labelCentroid[0]} cy={labelCentroid[1]} r={15} fill={data.svg.fill} />
					<SvgText
						x={labelCentroid[0]}
						y={labelCentroid[1]}
						fill="white"
						textAnchor="middle"
						alignmentBaseline="middle"
						fontSize={10}
						strokeWidth={0.2}
						stroke="black">
						{textLabel}
					</SvgText>
				</G>
			);
		});
	};

	const getTopConsumedProducts = (consumedProductsList) => {
		let productCounts = {};

		consumedProductsList.forEach((product) => {
			if (productCounts[product.name]) {
				productCounts[product.name] += 1; // Increment the count of the product by 1
			} else {
				productCounts[product.name] = 1; // Initialize the count of the product to 1
			}
		});

		const sortedProducts = Object.entries(productCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		return sortedProducts.map(([name, count]) => ({ name, count }));
	};

	const getTopFavoriteRecipes = (finishedRecipes) => {
		let recipeCounts = {};

		finishedRecipes.forEach((recipe) => {
			if (recipeCounts[recipe.id]) {
				recipeCounts[recipe.id].count += 1;
			} else {
				recipeCounts[recipe.id] = { ...recipe, count: 1 };
			}
		});

		const sortedRecipes = Object.values(recipeCounts)
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);

		return sortedRecipes;
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} resizeMode="contain" />
			</View>
			<ScrollView>
				<View style={styles.statisticsContainer}>
					{/* <Text style={styles.title}>Statistics</Text> */}
					<View style={styles.pieChartContainer}>
						<PieChart
							style={{ height: 150 }}
							valueAccessor={({ item }) => item.amount}
							data={[
								{
									key: "Consumed",
									amount: userData.consumedProducts,
									svg: { fill: COLORS.primary },
								},
								{
									key: "Expired",
									amount: userData.expiredProducts,
									svg: { fill: COLORS.error },
								},
							]}
							spacing={0}
							outerRadius={"95%"}
							renderDecorator={renderPieLabel}
						/>
					</View>
					<View style={styles.statisticItem}>
						<View style={styles.iconAndLabelContainer}>
							<MaterialIcons name="eco" size={30} color={COLORS.primary} />
							<Text style={styles.label}>Total Consumed Products:</Text>
						</View>
						<Text style={styles.value}>{userData.consumedProducts}</Text>
					</View>
					<View style={styles.statisticItem}>
						<View style={styles.iconAndLabelContainer}>
							<MaterialIcons name="takeout-dining" size={30} color={COLORS.error} />
							<Text style={styles.label}>Total Expired Products:</Text>
						</View>
						<Text style={styles.value}>{userData.expiredProducts}</Text>
					</View>
					<View style={styles.statisticItem}>
						<View style={styles.iconAndLabelContainer}>
							<MaterialIcons name="warning" size={30} color={COLORS.warning} />
							<Text style={styles.label}>Total Expiring Products:</Text>
						</View>
						<Text style={styles.value}>{userData.expiringProducts}</Text>
					</View>
					<View style={styles.statisticItem}>
						<View style={styles.iconAndLabelContainer}>
							<MaterialIcons name="check-circle" size={30} color={COLORS.secondary} />
							<Text style={styles.label}>Total Finished Recipes:</Text>
						</View>
						<Text style={styles.value}>{userData.finishedRecipes.length}</Text>
					</View>
					<View style={[styles.topThreeItemContainer, styles.topThreeContainer]}>
						<View style={styles.iconAndLabelContainerTop3}>
							<MaterialIcons name="leaderboard" size={30} color={COLORS.secondary} />
							<Text style={styles.label}>Top 3 Most Consumed Products:</Text>
						</View>
						{topConsumedProducts.map((product, index) => (
							<View style={styles.topThreeItem} key={index}>
								<Text style={styles.topThreeIndex}>{index + 1}. </Text>
								<View style={{ flex: 1 }}>
									<Text style={styles.topThreeName}>{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</Text>
								</View>
								<Text style={styles.valueTop3}>{product.count}</Text>
							</View>
						))}
					</View>
					<View style={[styles.topThreeItemContainer, styles.topThreeContainer]}>
						<View style={styles.iconAndLabelContainerTop3}>
							<MaterialIcons name="leaderboard" size={30} color={COLORS.secondary} />
							<Text style={styles.label}>Top 3 Most Consumed Products:</Text>
						</View>
						{topFavoriteRecipes.map((recipe, index) => (
							<View style={styles.topThreeItem} key={index}>
								<Text style={styles.topThreeIndex}>{index + 1}. </Text>
								<View style={{ flex: 1 }}>
									<Text style={styles.topThreeName}>
										{recipe.title ? recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1) : "N/A"}
									</Text>
								</View>
								<Text style={styles.valueTop3}>{recipe.count}</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Statistic;
