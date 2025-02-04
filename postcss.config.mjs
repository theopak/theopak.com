/** @type {require("postcss-load-config").Config} */
const postcssConfig = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-nesting': {},
    autoprefixer: {},
  },
};

export default postcssConfig;
