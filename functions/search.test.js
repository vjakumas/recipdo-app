import axios from "axios";
import Constants from "expo-constants";
import { fetchData, handleSearch } from "./SearchFunctions";

jest.mock("axios");
jest.mock("expo-constants");

describe("fetchData", () => {
	let setSearchResultsId;
	let setSearchResultsData;
	let setLoading;

	beforeEach(() => {
		// Reset the mocks before each test
		axios.request.mockReset();
		Constants.manifest.extra.spoonacularApiKey = "testApiKey";

		// Create mock functions for the setState callbacks
		setSearchResultsId = jest.fn();
		setSearchResultsData = jest.fn();
		setLoading = jest.fn();
	});

	it("should fetch data and update state", async () => {
		// Mock the axios.request function to return some test data
		axios.request.mockResolvedValueOnce({
			data: {
				results: [{ id: 1 }, { id: 2 }, { id: 3 }],
			},
		});
		axios.request.mockResolvedValueOnce({
			data: ["recipe1", "recipe2", "recipe3"],
		});

		await fetchData("test", "Name", setSearchResultsId, setSearchResultsData, setLoading);

		// Check that the setState functions were called with the correct arguments
		expect(setSearchResultsId).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }, { id: 3 }]);
		expect(setSearchResultsData).toHaveBeenCalledWith(["recipe1", "recipe2", "recipe3"]);
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("should handle errors", async () => {
		// Mock the axios.request function to throw an error
		axios.request.mockRejectedValueOnce(new Error("test error"));

		await fetchData("test", "Name", setSearchResultsId, setSearchResultsData, setLoading);

		// Check that the setState functions were called with the correct arguments
		expect(setSearchResultsId).toHaveBeenCalledWith([]);
		expect(setSearchResultsData).toHaveBeenCalledWith([]);
		expect(setLoading).toHaveBeenCalledWith(false);
	});
});

describe("handleSearch", () => {
	let setSearchPerformed;
	let setLoading;
	let setSearchResultsId;
	let setSearchResultsData;

	beforeEach(() => {
		// Reset the mocks before each test
		axios.request.mockReset();
		Constants.manifest.extra.spoonacularApiKey = "testApiKey";

		// Create mock functions for the setState callbacks
		setSearchPerformed = jest.fn();
		setLoading = jest.fn();
		setSearchResultsId = jest.fn();
		setSearchResultsData = jest.fn();
	});

	it("should call fetchData and update state", async () => {
		// Mock the axios.request function to return some test data
		axios.request.mockResolvedValueOnce({
			data: {
				results: [{ id: 1 }, { id: 2 }, { id: 3 }],
			},
		});
		axios.request.mockResolvedValueOnce({
			data: ["recipe1", "recipe2", "recipe3"],
		});

		await handleSearch(false, "test", "test", setSearchPerformed, setLoading, "Name", setSearchResultsId, setSearchResultsData);

		// Check that the setState functions were called with the correct arguments
		expect(setSearchPerformed).toHaveBeenCalledWith(true);
		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setSearchResultsId).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }, { id: 3 }]);
		expect(setSearchResultsData).toHaveBeenCalledWith(["recipe1", "recipe2", "recipe3"]);
		expect(setLoading).toHaveBeenCalledWith(false);
	});

	it("should handle errors", async () => {
		// Mock the axios.request function to throw an error
		axios.request.mockRejectedValueOnce(new Error("test error"));

		await handleSearch(false, "test", "test", setSearchPerformed, setLoading, "Name", setSearchResultsId, setSearchResultsData);

		// Check that the setState functions were called with the correct arguments
		expect(setSearchPerformed).toHaveBeenCalledWith(true);
		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setSearchResultsId).toHaveBeenCalledWith([]);
		expect(setSearchResultsData).toHaveBeenCalledWith([]);
		expect(setLoading).toHaveBeenCalledWith(false);
	});
});
