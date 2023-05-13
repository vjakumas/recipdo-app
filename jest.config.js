module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
	setupFiles: ["./jest.setup.js"],
	transform: {
		"^.+\\.js$": "<rootDir>/node_modules/babel-jest",
		"\\.(ts|tsx)$": "ts-jest",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|firebase)",
	],
};
