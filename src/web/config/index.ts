console.log("API URL:", process.env.API_URL);

export const config = {
  apiUrl: process.env.API_URL || "http://localhost:3000/api/v1",
  wsUrl: process.env.WS_URL || "ws://localhost:3000",
};
