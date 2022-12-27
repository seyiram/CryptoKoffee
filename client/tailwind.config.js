/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}",],
  theme: {
    extend: {
      colors: {
        "cryptokoffee": "#F79E61",
        "cryptokoffee-400": "#fad5b9",
        "cryptokoffee-purple": "#B441A1",
      },
      fontFamily: {
        'Gilroy-Black': ['Gilroy Black', 'sans-serif'],
        'rouge-script':["Rouge Script", 'sans-serif'],
      },
      backgroundSize: {
        '50%': '50%',
        '20%': '20%',
      },
    },
  },
  plugins: [],
}
