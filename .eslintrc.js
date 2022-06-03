module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		// "plugin:react/recommended",
		// "airbnb",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: [
		// "react",
		"@typescript-eslint",
	],
	rules: {
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"react/react-in-jsx-scope": "off",
		"react/display-name": "off",
		"no-empty-pattern": "off",
		"no-var": 2,
		"no-param-reassign": 2,
		"no-console": 2,
	},
};
