import { getTopConsumedProducts, getTopFavoriteRecipes } from "../functions/StatisticsFunctions";

describe("StatisticsFunctions", () => {
	describe("getTopConsumedProducts", () => {
		it("should correctly count and sort products", () => {
			const products = [{ name: "apple" }, { name: "banana" }, { name: "apple" }, { name: "carrot" }, { name: "banana" }, { name: "apple" }];
			const result = getTopConsumedProducts(products);

			expect(result).toEqual([
				{ name: "apple", count: 3 },
				{ name: "banana", count: 2 },
				{ name: "carrot", count: 1 },
			]);
		});
	});

	describe("getTopFavoriteRecipes", () => {
		it("should correctly count and sort recipes", () => {
			const recipes = [
				{ id: "1", title: "pizza" },
				{ id: "2", title: "pasta" },
				{ id: "1", title: "pizza" },
				{ id: "3", title: "salad" },
				{ id: "2", title: "pasta" },
				{ id: "1", title: "pizza" },
			];
			const result = getTopFavoriteRecipes(recipes);

			expect(result).toEqual([
				{ id: "1", title: "pizza", count: 3 },
				{ id: "2", title: "pasta", count: 2 },
				{ id: "3", title: "salad", count: 1 },
			]);
		});
	});
});
