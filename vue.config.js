module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/dash/' : '/',
  /* devServer: {
    proxy: {
      '/vftoken': {
        target: 'https://contenidos.valorfuturo.com',
        secure: false,
      },
      '/vfrest': {
        target: 'https://contenidos.valorfuturo.com',
        secure: false,
      },
    },
  }, */
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/_app.scss";',
      },
    },
  },
};
