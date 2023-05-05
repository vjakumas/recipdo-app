const COLORS = {
	primary: "#40BC75",
	secondary: "#444262",
	tertiary: "#FF7754",

	darkGray: "#252525",
	gray: "#83829A",
	gray2: "#C1C0C8",
	lightGray: "#DEDEDE",

	white: "#F3F4F8",
	lightWhite: "#FAFAFC",

	warning: "#DFAA28",
	error: "#FF5C5C",
};

const FONT = {
	black: "PoppinsBlack",
	blackItalic: "PoppinsBlackItalic",
	bold: "PoppinsBold",
	boldItalic: "PoppinsBoldItalic",
	extraBold: "PoppinsExtraBold",
	extraBoldItalic: "PoppinsExtraBoldItalic",
	light: "PoppinsLight",
	lightItalic: "PoppinsLightItalic",
	italic: "PoppinsItalic",
	extraLight: "PoppinsExtraLight",
	extraLightItalic: "PoppinsExtraLightItalic",
	medium: "PoppinsMedium",
	mediumItalic: "PoppinsMediumItalic",
	regular: "PoppinsRegular",
	semiBold: "PoppinsSemiBold",
	semiBoldItalic: "PoppinsSemiBoldItalic",
	thin: "PoppinsThin",
	thinItalic: "PoppinsThinItalic",
};

const SIZES = {
	xSmall: 10,
	small: 12,
	medium: 16,
	large: 20,
	xLarge: 24,
	xxLarge: 32,
};

const SHADOWS = {
	small: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 2,
	},
	medium: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 5.84,
		elevation: 5,
	},

	xLarge: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.05,
		shadowRadius: 8.84,
		elevation: 5,
	},
	xxLarge: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.15,
		shadowRadius: 5.84,
		elevation: 5,
	},
};

export { COLORS, FONT, SIZES, SHADOWS };
