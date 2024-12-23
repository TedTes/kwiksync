const isDevelopment = process.env.NODE_ENV === "development";
export const envVariables = {
  webServerURL: process.env.APP_SERVER_URL || "http://localhost:3000",
  accessTokenKey: process.env.ACCESS_TOKEN_KEY || "access_secret",
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY || "refresh_secret",
  magicLinkSecretKey: process.env.MAGIC_LINK_SECRET_KEY || "secret_key",
  postgressConfig: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || "5432",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "postgres",
    synchronize: isDevelopment ? "true" : process.env.POSTGRES_SYNCHRONIZE,
    logging: isDevelopment ? "true" : process.env.POSTGRES_LOGGING,
  },
};
