/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue", "./public/**/*.html", "./src/**/*.js"],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
      },
      textColor: {
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'text': 'var(--text-color)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

