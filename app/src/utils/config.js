const config = {
  development: {
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGODB_DEV_URI,
  },
  production: {
    port: process.env.PRODUCTION_PORT || 8000,
    mongoUri: process.env.MONGODB_PROD_URI,
  },
};

export default config[process.env.NODE_ENV || "development"];
