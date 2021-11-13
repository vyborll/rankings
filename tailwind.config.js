const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	purge: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				dark: {
					700: '#95959a',
					800: '#32353d',
					900: '#272a30',
					950: '#292c32',
				},
				divider: {
					900: '#393e46',
				},
				green: {
					940: '#0BF894',
					950: '#20ce70',
					960: '#20ce711a',
				},
				blue: {
					950: '#35a3f1',
					960: 'rgb(32, 129, 226)',
				},
			},
			opacity: {
				2: '0.02',
				3: '0.03',
			},
			zIndex: {
				'-10': '-10',
				'-5': '-5',
				'1': 1,
			}
		},
		screens: {
			xs: '475px',
			...defaultTheme.screens,
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('tailwind-scrollbar'), require('@tailwindcss/line-clamp')],
};
