/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/dist',
    public: '/',
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
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
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
