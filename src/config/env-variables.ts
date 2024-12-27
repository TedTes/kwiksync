const isDevelopment = process.env.NODE_ENV === "development";
export const envVariables = {
  webServerURL: process.env.APP_SERVER_URL || "http://localhost:3001",
  accessTokenKey: process.env.ACCESS_TOKEN_KEY || "access_secret",
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY || "refresh_secret",
  magicLinkSecretKey: process.env.MAGIC_LINK_SECRET_KEY || "secret_key",
  postgressConfig: {
    url:
      process.env.POSTGRES_DB_URL ||
      "postgres://root:test@localhost:5432/kwiksync",
    synchronize: process.env.NODE_ENV !== "production",
    logging: isDevelopment ? "true" : process.env.POSTGRES_LOGGING,
  },
};
