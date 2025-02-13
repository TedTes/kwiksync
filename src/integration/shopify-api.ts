import axios from "axios";
import { PlatformApi } from "../interfaces";

export class ShopifyAPI implements PlatformApi {
  private shop: string;
  private accessToken: string;
  private baseURL: string;
  constructor(shop: string, accessToken: string) {
    this.shop = shop;
    this.accessToken = accessToken;
    this.baseURL = `https://${shop}/admin/api/2024-01`;
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": this.accessToken,
    };
  }
  async updateStock(productId: string, stock: number): Promise<void> {
    try {
      // TODO: Shopify Admin API
      const response = await fetch(
        `${this.baseURL}/inventory_levels/set.json`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({
            inventory_item_id: productId,
            available: stock,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to update Shopify stock: ${error.message}`);
    }
  }

  async getStock(productId: string): Promise<number> {
    // TODO : Implementation for getting stock from Shopify

    return 0;
  }

  async validateProduct(productId: string): Promise<boolean> {
    //TODO: Validate if product exists in Shopify
    return true;
  }
  async getProducts(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/products.json`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data.products;
    } catch (error: any) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getProduct(productId: number) {
    try {
      const response = await axios.get(
        `${this.baseURL}/products/${productId}.json`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.product;
    } catch (error: any) {
      console.error(
        "Error fetching product:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getOrders(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/orders.json`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data.orders;
    } catch (error: any) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get inventory levels for a specific location
  async getInventoryLevels(locationId: string, params = {}) {
    try {
      const response = await axios.get(
        `${this.baseURL}/inventory_levels.json`,
        {
          headers: this.getHeaders(),
          params: {
            location_ids: locationId,
            ...params,
          },
        }
      );
      return response.data.inventory_levels;
    } catch (error: any) {
      console.error(
        "Error fetching inventory levels:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async adjustInventoryLevel(
    locationId: string,
    inventoryItemId: string,
    adjustment: number
  ) {
    try {
      const response = await axios.post(
        `${this.baseURL}/inventory_levels/adjust.json`,
        {
          location_id: locationId,
          inventory_item_id: inventoryItemId,
          available_adjustment: adjustment,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.inventory_level;
    } catch (error: any) {
      console.error(
        "Error adjusting inventory:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get all customers
  async getCustomers(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/customers.json`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data.customers;
    } catch (error: any) {
      console.error(
        "Error fetching customers:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async createWebhook(topic: string, address: string) {
    try {
      const response = await axios.post(
        `${this.baseURL}/webhooks.json`,
        {
          webhook: {
            topic,
            address,
            format: "json",
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.webhook;
    } catch (error: any) {
      console.error(
        "Error creating webhook:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getShopInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/shop.json`, {
        headers: this.getHeaders(),
      });
      return response.data.shop;
    } catch (error: any) {
      console.error(
        "Error fetching shop info:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
