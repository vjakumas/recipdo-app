import axios from "axios";
import { getRecipeInformationBulk, getRandomRecipes, getSimilarRecipes, prioritizePantryItems, timestampToDate } from "./RecipeFunctions"; // replace with actual path

const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);

jest.mock("axios");

afterEach(() => {
	mock.reset();
});

describe("prioritizePantryItems", () => {
	it("sorts pantry items based on isExpiringSoon and date", () => {
		const pantryItems = [
			{ date: { seconds: 172800, nanoseconds: 0 }, isExpiringSoon: true },
			{ date: { seconds: 86400, nanoseconds: 0 }, isExpiringSoon: false },
			{ date: { seconds: 259200, nanoseconds: 0 }, isExpiringSoon: true },
		];
		const result = prioritizePantryItems(pantryItems);
		expect(result).toEqual([
			{ date: { seconds: 172800, nanoseconds: 0 }, isExpiringSoon: true },
			{ date: { seconds: 259200, nanoseconds: 0 }, isExpiringSoon: true },
			{ date: { seconds: 86400, nanoseconds: 0 }, isExpiringSoon: false },
		]);
	});
});

describe("getRecipeInformationBulk", () => {
	it("fetches bulk recipe information", async () => {
		const mockData = [{ id: 1 }, { id: 2 }];
		mock.onGet("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk").reply(200, mockData);

		const result = await getRecipeInformationBulk([1, 2]);
		expect(result).toEqual(mockData);
	});
});

describe("getRandomRecipes", () => {
	it("fetches random recipes", async () => {
		const mockData = { recipes: [{ id: 1 }, { id: 2 }] };
		mock.onGet("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random").reply(200, mockData);

		const result = await getRandomRecipes(2);
		expect(result).toEqual([1, 2]);
	});
});

describe("getSimilarRecipes", () => {
	it("fetches similar recipes", async () => {
		const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
		mock.onGet(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1/similar`).reply(200, mockData);

		const result = await getSimilarRecipes(1, 2);
		expect(result).toEqual([1, 2]);
	});
});

describe("timestampToDate", () => {
	it("converts timestamp to date", () => {
		const timestamp = { seconds: 172800, nanoseconds: 0 };
		const result = timestampToDate(timestamp);
		expect(result).toEqual(new Date(172800 * 1000));
	});
});
