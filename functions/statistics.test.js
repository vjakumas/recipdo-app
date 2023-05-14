import { firestore } from "../config/firebase/config";
import firebase from "firebase/app";
import { getTopConsumedProducts, getTopFavoriteRecipes } from "./StatisticsFunctions";

jest.mock("../config/firebase/config");

describe("getTopConsumedProducts", () => {
	it("should return top 3 consumed products", () => {
		const consumedProductsList = [
			{ name: "kale" },
			{ name: "kale" },
			{ name: "apple" },
			{ name: "banana" },
			{ name: "banana" },
			{ name: "banana" },
		];

		const result = getTopConsumedProducts(consumedProductsList);

		expect(result).toEqual([
			{ name: "banana", count: 3 },
			{ name: "kale", count: 2 },
			{ name: "apple", count: 1 },
		]);
	});
});

describe("getTopFavoriteRecipes", () => {
	it("should return top 3 favorite recipes", () => {
		const finishedRecipes = [
			{ id: 1, title: "Recipe 1" },
			{ id: 2, title: "Recipe 2" },
			{ id: 1, title: "Recipe 1" },
			{ id: 3, title: "Recipe 3" },
			{ id: 2, title: "Recipe 2" },
			{ id: 2, title: "Recipe 2" },
		];

		const result = getTopFavoriteRecipes(finishedRecipes);

		expect(result).toEqual([
			{ id: 2, title: "Recipe 2", count: 3 },
			{ id: 1, title: "Recipe 1", count: 2 },
			{ id: 3, title: "Recipe 3", count: 1 },
		]);
	});
});

describe("getTopConsumedProducts", () => {
	it("should return an empty array when consumedProductsList is empty", () => {
		const consumedProductsList = [];

		const result = getTopConsumedProducts(consumedProductsList);

		expect(result).toEqual([]);
	});

	it("should return all products when there are less than 3 unique products", () => {
		const consumedProductsList = [{ name: "apple" }, { name: "banana" }, { name: "banana" }];

		const result = getTopConsumedProducts(consumedProductsList);

		expect(result).toEqual([
			{ name: "banana", count: 2 },
			{ name: "apple", count: 1 },
		]);
	});
});

describe("getTopFavoriteRecipes", () => {
	it("should return an empty array when finishedRecipes is empty", () => {
		const finishedRecipes = [];

		const result = getTopFavoriteRecipes(finishedRecipes);

		expect(result).toEqual([]);
	});

	it("should return all recipes when there are less than 3 unique recipes", () => {
		const finishedRecipes = [
			{ id: 1, title: "Recipe 1" },
			{ id: 2, title: "Recipe 2" },
			{ id: 2, title: "Recipe 2" },
		];

		const result = getTopFavoriteRecipes(finishedRecipes);

		expect(result).toEqual([
			{ id: 2, title: "Recipe 2", count: 2 },
			{ id: 1, title: "Recipe 1", count: 1 },
		]);
	});
});
