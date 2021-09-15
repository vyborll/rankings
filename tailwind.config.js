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
          950: '#292c32'
        },
        divider: {
          900: '#393e46'
        },
        green: {
          950: '#20ce70',
          960: '#20ce711a'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
