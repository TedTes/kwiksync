import axios from "axios";

const BASE_URL = "https://api.tiktok.com"; // TODO: Replace with the actual TikTok API base URL
const API_KEY = process.env.TIKTOK_API_KEY;

export const fetchTikTokInventory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inventory`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (response.status === 200) {
      return response.data.products;
    }

    throw new Error(`TikTok API returned status: ${response.status}`);
  } catch (error) {
    console.error("Error fetching TikTok inventory:", error);
    throw error;
  }
};

export const fetchProductEngagement = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/engagement`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (response.status === 200) {
      return response.data.products;
    }

    throw new Error(`TikTok API returned status: ${response.status}`);
  } catch (error) {
    console.error("Error fetching TikTok engagement data:", error);
    throw error;
  }
};
