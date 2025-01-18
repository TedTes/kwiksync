const isDevelopment = process.env.NODE_ENV === "development";

export const configAWS = {
  AWSaccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  AWSsecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.REGION,
  s3BucketName: process.env.S3_BUCKET,
};
export const configCDN = { cdnBaseURL: process.env.CDN_BASE_URL };
export const webServerURL = process.env.APP_SERVER_URL;
export const JWTkeys = {
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
};

export const magicLinkSecretKey = process.env.MAGIC_LINK_SECRET_KEY;
export const googleAuth20 = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,
};
export const postgressConfig = {
  url: process.env.POSTGRES_DB_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: isDevelopment ? "true" : process.env.POSTGRES_LOGGING,
};
