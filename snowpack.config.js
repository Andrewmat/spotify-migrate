/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: '.',

  mount: {
    public: {
      url: '/',
      static: true,
    },
    src: '/dist',
    /* ... */
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-react-refresh',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {
      match: 'routes',
      src: '.*',
      dest: '/',
    },
  ],
  alias: {
    '@': './src',
  },
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    // minify: true,
    // target: 'es2017',
    // splitting: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
}
