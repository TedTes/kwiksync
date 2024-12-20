const isDevelopment = process.env.NODE_ENV === "development";
export const envVariables = {
  appServerURL: isDevelopment
    ? "http://localhost:3000"
    : process.env.APP_SERVER_URL || "http://localhost:3000",
  accessTokenKey: isDevelopment
    ? "access_secret"
    : process.env.ACCESS_TOKEN_KEY || "access_secret",
  refreshTokenKey: isDevelopment
    ? "refresh_secret"
    : process.env.REFRESH_TOKEN_KEY || "refresh_secret",
  magicLinkSecretKey: isDevelopment
    ? "secret_key"
    : process.env.MAGIC_LINK_SECRET_KEY || "secret_key",
  postgressConfig: {
    host: isDevelopment
      ? "localhost"
      : process.env.POSTGRES_HOST || "localhost",
    port: isDevelopment ? "5432" : process.env.POSTGRES_PORT || "5432",
    username: isDevelopment
      ? "postgres"
      : process.env.POSTGRES_USER || "postgres",
    password: isDevelopment
      ? "password"
      : process.env.POSTGRES_PASSWORD || "password",
    database: isDevelopment
      ? "postgres"
      : process.env.POSTGRES_DB || "postgres",
    synchronize: isDevelopment ? "true" : process.env.POSTGRES_SYNCHRONIZE,
    logging: isDevelopment ? "true" : process.env.POSTGRES_LOGGING,
  },
};
