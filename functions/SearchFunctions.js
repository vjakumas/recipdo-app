import axios from "axios";
import Constants from "expo-constants";

export const fetchData = async (searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading) => {
	let url = "";
	let options = {};
	if (searchType === "Name") {
		url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search";
		options = {
			method: "GET",
			url: url,
			params: {
				query: searchText,
				number: "10",
			},
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};
	} else {
		url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients";
		options = {
			method: "GET",
			url: url,
			params: {
				ingredients: searchText,
				number: "10",
			},
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};
	}

	try {
		const searchResponse = await axios.request(options);

		const recipeIds = (searchResponse.data.results || searchResponse.data).map((recipe) => recipe.id).join(",");

		const recipeInfoOptions = {
			method: "GET",
			url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
			params: { ids: recipeIds },
			headers: {
				"content-type": "application/octet-stream",
				"X-RapidAPI-Key": Constants.manifest.extra.spoonacularApiKey,
				"X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
			},
		};

		const [, recipeInfoResponse] = await Promise.all([Promise.resolve(searchResponse), axios.request(recipeInfoOptions)]);

		setSearchResultsId(searchResponse.data.results || searchResponse.data);
		setSearchResultsData(recipeInfoResponse.data);
		setLoading(false);
	} catch (error) {
		setSearchResultsId([]);
		setSearchResultsData([]);
		setLoading(false);
	}
};

export const handleSearch = async (
	fromProduct,
	currentSearchText,
	searchText,
	setSearchPerformed,
	setLoading,
	searchType,
	setSearchResultsId,
	setSearchResultsData
) => {
	setSearchPerformed(true);
	setLoading(true);
	await fetchData(fromProduct ? currentSearchText : searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading);
};
