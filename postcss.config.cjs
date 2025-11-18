module.exports = (ctx) => {
  return {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
    // Ensure PostCSS has proper context for asset resolution
    // The 'from' option is automatically provided by Vite
    map: ctx.env === 'development' ? { inline: false } : false,
  };
};
