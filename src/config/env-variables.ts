export const envVariables = {
  appServerURL: process.env.APP_SERVER_URL || "http://localhost:3000",
  accessTokenKey: process.env.ACCESS_TOKEN_KEY || "access_secret",
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY || "refresh_secret",
  magicLinkSecretKey: process.env.MAGIC_LINK_SECRET_KEY || "secret_key",
};
