import React, { useState } from "react";
import {
  Package,
  Link2,
  TrendingUp,
  ShoppingCart,
  Layers,
  Zap,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";
import "../../index.css";
interface Platform {
  name: string;
  status: string;
  products: number;
  lastSync: string;
  syncIssues: number;
  syncHealth: number;
  productCategories: string[];
  performanceMetrics: {
    conversionRate: number;
    averageOrderValue: number;
    totalSales: number;
  };
  revenue: number;
  lowStockItems: number;
}
const InventorySyncDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );

  const platformConnections = [
    {
      name: "TikTok",
      status: "connected",
      products: 24,
      lastSync: "2 mins ago",
      syncIssues: 1,
      revenue: 1245.5,
      lowStockItems: 3,
      syncHealth: 0.85, // 85% sync health
      productCategories: ["Fashion", "Accessories"],
      performanceMetrics: {
        conversionRate: 2.5,
        averageOrderValue: 45.2,
        totalSales: 5678.9,
      },
    },
    {
      name: "Instagram",
      status: "connected",
      products: 36,
      lastSync: "5 mins ago",
      syncIssues: 0,
      revenue: 2345.75,
      lowStockItems: 2,
      syncHealth: 1, // 100% sync health
      productCategories: ["Beauty", "Lifestyle"],
      performanceMetrics: {
        conversionRate: 3.2,
        averageOrderValue: 62.5,
        totalSales: 7845.6,
      },
    },
    {
      name: "Shopify",
      status: "connected",
      products: 42,
      lastSync: "1 min ago",
      syncIssues: 2,
      revenue: 3456.8,
      lowStockItems: 5,
      syncHealth: 0.75, // 75% sync health
      productCategories: ["Electronics", "Home Goods"],
      performanceMetrics: {
        conversionRate: 2.8,
        averageOrderValue: 55.3,
        totalSales: 6543.21,
      },
    },
  ];

  // Platform Details Modal Component
  const PlatformDetailsModal = ({
    platform,
    onClose,
  }: {
    platform: Platform | null;
    onClose: () => void;
  }) => {
    if (!platform) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {platform.name} Platform Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Sync Performance</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sync Health</span>
                      <span>{(platform.syncHealth * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          platform.syncHealth > 0.8
                            ? "bg-green-500"
                            : platform.syncHealth > 0.5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${platform.syncHealth * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p>Last Sync: {platform.lastSync}</p>
                    <p>Sync Issues: {platform.syncIssues}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-2">
                  <p>
                    Conversion Rate:{" "}
                    {platform.performanceMetrics.conversionRate}%
                  </p>
                  <p>
                    Avg. Order Value: $
                    {platform.performanceMetrics.averageOrderValue}
                  </p>
                  <p>
                    Total Sales: $
                    {platform.performanceMetrics.totalSales.toFixed(2)}
                  </p>
                  <p>
                    Product Categories: {platform.productCategories.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
          {/* Top Navigation */}
          <div className="flex border-b pb-2 mb-4 space-x-4 items-center justify-between">
            <div className="flex space-x-4">
              {[
                { key: "overview", icon: Layers, label: "Overview" },
                { key: "connections", icon: Link2, label: "Platforms" },
                { key: "inventory", icon: Package, label: "Inventory" },
                { key: "analytics", icon: TrendingUp, label: "Analytics" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center space-x-2 p-3 rounded-lg transition-colors
                    ${
                      activeTab === tab.key
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100"
                    }
                  `}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
            <button className="flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
              <RefreshCw size={16} />
              <span>Sync Now</span>
            </button>
          </div>

          <div className="space-y-4">
            {platformConnections.map((platform) => (
              <div
                key={platform.name}
                className={`
                  border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer relative
                  ${
                    platform.syncIssues > 0
                      ? "border-yellow-200 bg-yellow-50/50"
                      : "border-gray-200"
                  }
                `}
                onClick={() => setSelectedPlatform(platform)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{platform.name}</h3>
                    <p
                      className={`
                      font-medium mb-3 
                      ${
                        platform.status === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                    >
                      {platform.status === "connected"
                        ? "Connected"
                        : "Disconnected"}
                    </p>
                  </div>
                  <Zap
                    className={
                      platform.status === "connected"
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{platform.products} Products Synced</p>
                  <p>Last Sync: {platform.lastSync}</p>
                  <div className="flex space-x-2 mt-2">
                    {platform.syncIssues > 0 && (
                      <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        <AlertTriangle size={14} className="mr-1" />
                        {platform.syncIssues} Sync Issues
                      </div>
                    )}
                    <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <ShoppingCart size={14} className="mr-1" />$
                      {platform.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Sync Health Indicator */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      platform.syncHealth > 0.8
                        ? "bg-green-500"
                        : platform.syncHealth > 0.5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${platform.syncHealth * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Realtime Inventory Updates */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 text-blue-600" />
                <h2 className="font-bold text-lg">
                  Realtime Inventory Changes
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                Last updated: Just now
              </span>
            </div>
            {[
              {
                product: "Summer Crop Top",
                platform: "TikTok",
                stockChange: -3,
                currentStock: 12,
                timestamp: "2 mins ago",
                status: "low stock",
              },
              {
                product: "Vintage Sneakers",
                platform: "Instagram",
                stockChange: -2,
                currentStock: 8,
                timestamp: "7 mins ago",
                status: "critical stock",
              },
            ].map((update, index) => (
              <div
                key={index}
                className={`
                  flex justify-between items-center border-b py-3 last:border-b-0
                  ${
                    update.status === "critical stock"
                      ? "bg-red-50 rounded-lg px-3 -mx-3"
                      : update.status === "low stock"
                      ? "bg-yellow-50 rounded-lg px-3 -mx-3"
                      : ""
                  }
                `}
              >
                <div>
                  <p className="font-medium">{update.product}</p>
                  <p className="text-sm text-gray-500">
                    Platform: {update.platform}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`
                      font-bold block
                      ${
                        update.stockChange < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    `}
                  >
                    {update.stockChange > 0 ? "+" : ""}
                    {update.stockChange} units
                  </span>
                  <p className="text-xs text-gray-400">
                    Current Stock: {update.currentStock}
                  </p>
                  <p
                    className={`
                    text-xs font-medium uppercase
                    ${
                      update.status === "critical stock"
                        ? "text-red-600"
                        : update.status === "low stock"
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }
                  `}
                  >
                    {update.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Details Modal */}
      {selectedPlatform && (
        <PlatformDetailsModal
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
        />
      )}
    </div>
  );
};

export default InventorySyncDashboard;
