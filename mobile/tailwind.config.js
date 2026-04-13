/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
       colors: {
        cyan: {
          400: '#22d3ee',
          950: '#083344',
        }
      }
    },
  },
  plugins: [],
}
