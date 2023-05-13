import axios from "axios";
import { fetchData, handleSearch } from "../SearchFunctions";

jest.mock("axios");
jest.mock("expo-constants");

describe("SearchFunctions", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("fetches data successfully from an API", async () => {
		const searchText = "apple";
		const searchType = "Name";
		const setSearchResultsId = jest.fn();
		const setSearchResultsData = jest.fn();
		const setLoading = jest.fn();
		const data = { data: [{ id: 1 }, { id: 2 }] };

		axios.request.mockResolvedValue(data);

		await fetchData(searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading);

		expect(setSearchResultsId).toHaveBeenCalledWith(data.data);
		expect(setSearchResultsData).toHaveBeenCalled();
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("fetches correct data successfully from an API - By Name", async () => {
		const searchText = "kale salads";
		const searchType = "Name";
		const setSearchResultsId = jest.fn();
		const setSearchResultsData = jest.fn();
		const setLoading = jest.fn();
		const responseData = {
			results: [
				{
					id: 203617,
					title: "Serious Salads: Kale, Apple and Pancetta Salad",
					image: "https://spoonacular.com/recipeImages/203617-312x231.jpg",
					imageType: "jpg",
				},
				{
					id: 984062,
					title: "Raw Kale Salad with Creamy Tahini Dressing",
					image: "https://spoonacular.com/recipeImages/984062-312x231.jpg",
					imageType: "jpg",
				},
			],
			offset: 0,
			number: 10,
			totalResults: 2,
		};

		axios.request.mockResolvedValue({ data: responseData });

		await fetchData(searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading);

		expect(setSearchResultsId).toHaveBeenCalledWith(responseData.results);
		expect(setSearchResultsData).toHaveBeenCalled();
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("fetches correct data successfully from an API - By Ingredient", async () => {
		const searchText = "kale salads";
		const searchType = "Name";
		const setSearchResultsId = jest.fn();
		const setSearchResultsData = jest.fn();
		const setLoading = jest.fn();
		const responseData = {
			results: [
				{
					id: 473243,
					title: "Green Lemonade",
					image: "https://spoonacular.com/recipeImages/473243-312x231.jpg",
					imageType: "jpg",
					usedIngredientCount: 3,
					missedIngredientCount: 1,
					missedIngredients: [
						{
							id: 11206,
							amount: 1.0,
							unit: "",
							unitLong: "",
							unitShort: "",
							aisle: "Produce",
							name: "cucumber",
							original: "1 cucumber (I leave the skin on)",
							originalName: "cucumber (I leave the skin on)",
							meta: ["(I leave the skin on)"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/cucumber.jpg",
						},
					],
					usedIngredients: [
						{
							id: 1089003,
							amount: 1.0,
							unit: "",
							unitLong: "",
							unitShort: "",
							aisle: "Produce",
							name: "granny smith apple",
							original: "1 Granny Smith apple (remove core)",
							originalName: "Granny Smith apple (remove core)",
							meta: ["(remove core)"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/grannysmith-apple.png",
						},
						{
							id: 11233,
							amount: 1.0,
							unit: "bunch",
							unitLong: "bunch",
							unitShort: "bunch",
							aisle: "Produce",
							name: "kale",
							original: "1 bunch kale (use stalks and all)",
							originalName: "kale (use stalks and all)",
							meta: ["(use stalks and all)"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/kale.jpg",
						},
						{
							id: 9150,
							amount: 1.0,
							unit: "",
							unitLong: "",
							unitShort: "",
							aisle: "Produce",
							name: "lemon",
							original: "1 lemon (I leave the peel on)",
							originalName: "lemon (I leave the peel on)",
							meta: ["(I leave the peel on)"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/lemon.png",
						},
					],
					unusedIngredients: [],
					likes: 3431,
				},
				{
					id: 706167,
					title: "Everyday Green",
					image: "https://spoonacular.com/recipeImages/706167-312x231.jpg",
					imageType: "jpg",
					usedIngredientCount: 3,
					missedIngredientCount: 1,
					missedIngredients: [
						{
							id: 11297,
							amount: 3.0,
							unit: "ounces",
							unitLong: "ounces",
							unitShort: "oz",
							aisle: "Produce;Spices and Seasonings",
							name: "parsley leaves and stems",
							original: "3 ounces coarsely chopped parsley leaves and stems (1 bunch)",
							originalName: "coarsely chopped parsley leaves and stems (1 bunch)",
							meta: ["coarsely chopped", "(1 bunch)"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/parsley.jpg",
						},
					],
					usedIngredients: [
						{
							id: 11233,
							amount: 6.0,
							unit: "cups",
							unitLong: "cups",
							unitShort: "cup",
							aisle: "Produce",
							name: "kale",
							original: "4 ounces stemmed chopped kale (6 packed cups)",
							originalName: "ounces stemmed chopped kale (6 packed cups)",
							meta: ["packed", "stemmed", "chopped"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/kale.jpg",
						},
						{
							id: 9150,
							amount: 2.0,
							unit: "ounces",
							unitLong: "ounces",
							unitShort: "oz",
							aisle: "Produce",
							name: "lemon",
							original: "2 ounces peeled lemon",
							originalName: "peeled lemon",
							meta: ["peeled"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/lemon.png",
						},
						{
							id: 1029003,
							amount: 6.0,
							unit: "ounces",
							unitLong: "ounces",
							unitShort: "oz",
							aisle: "Produce",
							name: "sweet-tart apple",
							original: "6 ounces chopped sweet-tart apple, such as Braeburn (1 1/2 cups)",
							originalName: "chopped sweet-tart apple, such as Braeburn (1 1/2 cups)",
							meta: [" such as braeburn (1 1/2 cups)", "chopped"],
							image: "https://spoonacular.com/cdn/ingredients_100x100/grannysmith-apple.png",
						},
					],
					unusedIngredients: [],
					likes: 0,
				},
			],
			offset: 0,
			number: 10,
			totalResults: 2,
		};

		axios.request.mockResolvedValue({ data: responseData });

		await fetchData(searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading);

		expect(setSearchResultsId).toHaveBeenCalledWith(responseData.results);
		expect(setSearchResultsData).toHaveBeenCalled();
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("handles search request", async () => {
		const fromProduct = false;
		const currentSearchText = "";
		const searchText = "apple";
		const setSearchPerformed = jest.fn();
		const setLoading = jest.fn();
		const searchType = "Name";
		const setSearchResultsId = jest.fn();
		const setSearchResultsData = jest.fn();
		const data = { data: [{ id: 1 }, { id: 2 }] };

		axios.request.mockResolvedValue(data);

		await handleSearch(
			fromProduct,
			currentSearchText,
			searchText,
			setSearchPerformed,
			setLoading,
			searchType,
			setSearchResultsId,
			setSearchResultsData
		);

		expect(setSearchPerformed).toHaveBeenCalledWith(true);
		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setSearchResultsId).toHaveBeenCalledWith(data.data);
		expect(setSearchResultsData).toHaveBeenCalled();
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("fetches erroneously data from an API", async () => {
		const searchText = "apple";
		const searchType = "Name";
		const setSearchResultsId = jest.fn();
		const setSearchResultsData = jest.fn();
		const setLoading = jest.fn();

		axios.request.mockImplementation(() => Promise.reject(new Error()));

		await fetchData(searchText, searchType, setSearchResultsId, setSearchResultsData, setLoading);

		expect(setSearchResultsId).toHaveBeenCalledWith([]);
		expect(setSearchResultsData).toHaveBeenCalledWith([]);
		expect(setLoading).toHaveBeenCalledWith(false);
	});
});
