import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, Eye, Heart, Share2, ShoppingCart, Medal } from "lucide-react";

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

type SortByType = "engagement" | "views" | "sales";
export const ProductAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState<SortByType>("engagement");

  const products = [
    {
      id: 1,
      name: "Summer Crop Top",
      sku: "TOP-001",
      platform: "TikTok",
      rank: {
        engagement: 1,
        views: 1,
        sales: 2,
      },
      metrics: {
        views: 25600,
        likes: 3200,
        shares: 450,
        revenue: 1245.5,
        units_sold: 28,
        conversion_rate: 2.8,
      },
      trending: {
        views_change: 15,
        likes_change: 12,
        sales_change: 8,
      },
      performance: [
        { date: "Mon", views: 3500, sales: 4, revenue: 180 },
        { date: "Tue", views: 4200, sales: 5, revenue: 225 },
        { date: "Wed", views: 3800, sales: 4, revenue: 180 },
        { date: "Thu", views: 4500, sales: 6, revenue: 270 },
        { date: "Fri", views: 5100, sales: 7, revenue: 315 },
        { date: "Sat", views: 4800, sales: 6, revenue: 270 },
      ],
    },
    {
      id: 2,
      name: "Vintage Sneakers",
      sku: "SHO-002",
      platform: "Instagram",
      rank: {
        engagement: 2,
        views: 2,
        sales: 1,
      },
      metrics: {
        views: 18400,
        likes: 2800,
        shares: 320,
        revenue: 2345.75,
        units_sold: 35,
        conversion_rate: 3.2,
      },
      trending: {
        views_change: -5,
        likes_change: -2,
        sales_change: -3,
      },
      performance: [
        { date: "Mon", views: 2800, sales: 5, revenue: 335 },
        { date: "Tue", views: 2600, sales: 4, revenue: 268 },
        { date: "Wed", views: 3100, sales: 6, revenue: 402 },
        { date: "Thu", views: 2900, sales: 5, revenue: 335 },
        { date: "Fri", views: 3400, sales: 7, revenue: 469 },
        { date: "Sat", views: 3200, sales: 6, revenue: 402 },
      ],
    },
  ];

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="bg-white rounded-xl p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`${rankColors[product.rank[sortBy]]} flex items-center`}
          >
            <Medal size={24} />
            <span className="ml-1 font-bold">#{product.rank[sortBy]}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-500">SKU: {product.sku}</p>
            <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {product.platform}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">${product.metrics.revenue}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <Eye className="text-gray-400" size={20} />
            <span
              className={`text-sm ${
                product.trending.views_change > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.trending.views_change > 0 ? "↑" : "↓"}{" "}
              {Math.abs(product.trending.views_change)}%
            </span>
          </div>
          <p className="text-2xl font-bold">
            {(product.metrics.views / 1000).toFixed(1)}K
          </p>
          <p className="text-sm text-gray-500">Views</p>
          <p className={`text-xs mt-1 ${rankColors[product.rank.views]}`}>
            Rank #{product.rank.views}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <Heart className="text-gray-400" size={20} />
            <span
              className={`text-sm ${
                product.trending.likes_change > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.trending.likes_change > 0 ? "↑" : "↓"}{" "}
              {Math.abs(product.trending.likes_change)}%
            </span>
          </div>
          <p className="text-2xl font-bold">
            {(product.metrics.likes / 1000).toFixed(1)}K
          </p>
          <p className="text-sm text-gray-500">Likes</p>
          <p className={`text-xs mt-1 ${rankColors[product.rank.engagement]}`}>
            Rank #{product.rank.engagement}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <ShoppingCart className="text-gray-400" size={20} />
            <span
              className={`text-sm ${
                product.trending.sales_change > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.trending.sales_change > 0 ? "↑" : "↓"}{" "}
              {Math.abs(product.trending.sales_change)}%
            </span>
          </div>
          <p className="text-2xl font-bold">{product.metrics.units_sold}</p>
          <p className="text-sm text-gray-500">Units Sold</p>
          <p className={`text-xs mt-1 ${rankColors[product.rank.sales]}`}>
            Rank #{product.rank.sales}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={product.performance}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="views"
              stroke="#4F46E5"
              name="Views"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Share Rate</p>
          <p className="text-lg font-semibold">
            {((product.metrics.shares / product.metrics.views) * 100).toFixed(
              1
            )}
            %
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-lg font-semibold">
            {product.metrics.conversion_rate}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Avg. Order Value</p>
          <p className="text-lg font-semibold">
            ${(product.metrics.revenue / product.metrics.units_sold).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <select
            className="border p-2 rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortByType)}
          >
            <option value="engagement">Sort by Engagement</option>
            <option value="views">Sort by Views</option>
            <option value="sales">Sort by Sales</option>
          </select>
          <div className="flex space-x-2">
            {["week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {products
        .sort((a, b) => a.rank[sortBy] - b.rank[sortBy])
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
};