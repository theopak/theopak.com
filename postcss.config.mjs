/** @type {require("postcss-load-config").Config} */
const postcssConfig = {
  plugins: {
    tailwindcss: {},
    'postcss-nesting': {},
    autoprefixer: {},
  },
};

export default postcssConfig;
