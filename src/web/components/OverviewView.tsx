import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";

const OverviewTab = () => {
  const metrics = {
    totalProducts: 102,
    totalRevenue: 7047.05,
    totalSyncIssues: 3,
    platformCount: 3,
  };

  const recentActivity = [
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
  ];

  const platformData = [
    { name: "TikTok", revenue: 1245.5 },
    { name: "Instagram", revenue: 2345.75 },
    { name: "Shopify", revenue: 3456.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-blue-600 mb-2">
            <Package className="mr-2" />
            <h3 className="font-semibold">Total Products</h3>
          </div>
          <p className="text-2xl font-bold">{metrics.totalProducts}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center text-green-600 mb-2">
            <ShoppingCart className="mr-2" />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold">
            ${metrics.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <div className="flex items-center text-yellow-600 mb-2">
            <AlertTriangle className="mr-2" />
            <h3 className="font-semibold">Sync Issues</h3>
          </div>
          <p className="text-2xl font-bold">{metrics.totalSyncIssues}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center text-purple-600 mb-2">
            <TrendingUp className="mr-2" />
            <h3 className="font-semibold">Platforms</h3>
          </div>
          <p className="text-2xl font-bold">{metrics.platformCount}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4">Revenue by Platform</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                activity.status === "critical stock"
                  ? "bg-red-50"
                  : "bg-yellow-50"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.product}</p>
                  <p className="text-sm text-gray-600">
                    Platform: {activity.platform}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-medium">
                    {activity.stockChange} units
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {activity.currentStock}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
