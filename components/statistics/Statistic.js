import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Image, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { PieChart } from "react-native-svg-charts";
import { Circle, G, Line, Text as SvgText } from "react-native-svg";
import { fetchUserData, getTopConsumedProducts, getTopFavoriteRecipes } from "../../functions/StatisticsFunctions";
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

	useEffect(() => {
		const fetchData = async () => {
			await fetchUserData(setUserData);
		};

		fetchData();
	}, []);

	useEffect(() => {
		setTopConsumedProducts(getTopConsumedProducts(userData.consumedProductsList));
		setTopFavoriteRecipes(getTopFavoriteRecipes(userData.finishedRecipes));
	}, [userData]);

	const renderPieLabel = ({ slices }) => {
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

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={require("../../assets/images/logo-black-green.png")} style={styles.logo} resizeMode="contain" />
			</View>
			<ScrollView>
				<View style={styles.statisticsContainer}>
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
							<MaterialIcons name="warning" size={30} color={COLORS.warning} />
							<Text style={styles.label}>Total Expiring Products:</Text>
						</View>
						<Text style={styles.value}>{userData.expiringProducts}</Text>
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
							<Text style={styles.label}>Top 3 Most Popular Recipes:</Text>
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
