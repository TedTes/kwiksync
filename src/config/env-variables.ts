const isDevelopment = process.env.NODE_ENV === "development";

export const configAWS = {
  AWSaccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  AWSsecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.REGION,
  s3BucketName: process.env.S3_BUCKET,
};
export const smtpServerCreds = {
  smtpPassword: process.env.SMTP_PASS,
  smtpUser: process.env.SMTP_USER,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpSecure: process.env.SMTP_SECURE,
  emailFrom: process.env.EMAIL_FROM,
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
export const shopifyAuth = {
  shopifyClientId: process.env.SHOPIFY_CLIENT_ID,
  shopifyClientSecret: process.env.SHOPIFY_CLIENT_SECRET,
  shopifyCallbackURL:
    process.env.SHOPIFY_CALLBACK_URL ||
    "http://localhost:3000/auth/shopify/callback",
  shopifyRedirectURL:
    process.env.SHOPIFY_REDIRECT_URL ||
    "https://accounts.shopify.com/oauth/authorize",
  shopfiyScope:
    process.env.SHOPIFY_SCOPE || "read_products,write_products,read_orders",
  shopifyStateSecretKey: process.env.SHOPIFY_STATE_SECRET_KEY,
};
export const tiktokAuth = {
  tiktokClientKey: process.env.TIKTOK_CLIENT_KEY,
  tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET,
  tiktokCallbackURL:
    process.env.TIKTOK_CALLBACK_URL ||
    `http://localhost:3000/auth/tiktok/callback`,
  tiktokRedirectURL: process.env.TIKTOK_REDIRECT_URL,
  tiktokScope:
    process.env.TIKTOK_SCOPE || "product.read,product.write,order.read",
  tiktokStateSecretKey: process.env.TIKTOK_STATE_SECRET_KEY,
  tiktokTokenURL:
    process.env.TIKTOK_TOKEN_URL || "https://auth.tiktok-shops.com/oauth/token",
  tiktokAuthURL:
    process.env.TIKTOK_AUTH_URL ||
    "https://auth.tiktok-shops.com/oauth/authorize",
};
export const postgressConfig = {
  url: process.env.POSTGRES_DB_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: isDevelopment ? "true" : process.env.POSTGRES_LOGGING,
};
