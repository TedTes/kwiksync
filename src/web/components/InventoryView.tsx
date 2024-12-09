import React from "react";
import {
  Box,
  ShoppingBag,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Package,
} from "lucide-react";

const InventoryView = () => {
  const inventoryItems = [
    {
      id: 1,
      name: "Summer Crop Top",
      sku: "TOP-001",
      stock: 12,
      status: "low",
      platform: "TikTok",
      lastUpdated: "2 mins ago",
      trend: "down",
      change: -3,
    },
    {
      id: 2,
      name: "Vintage Sneakers",
      sku: "SHO-002",
      stock: 8,
      status: "critical",
      platform: "Instagram",
      lastUpdated: "7 mins ago",
      trend: "down",
      change: -2,
    },
    {
      id: 3,
      name: "Denim Jacket",
      sku: "JAC-003",
      stock: 45,
      status: "healthy",
      platform: "Shopify",
      lastUpdated: "12 mins ago",
      trend: "up",
      change: 5,
    },
  ];

  const stockSummary = {
    total: 65,
    low: 2,
    critical: 1,
    outOfStock: 0,
  };

  return (
    <div className="space-y-6">
      {/* Stock Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-blue-600 mb-2">
            <Package className="mr-2" size={20} />
            <h3 className="font-semibold">Total Stock</h3>
          </div>
          <p className="text-2xl font-bold">{stockSummary.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <div className="flex items-center text-yellow-600 mb-2">
            <AlertTriangle className="mr-2" size={20} />
            <h3 className="font-semibold">Low Stock</h3>
          </div>
          <p className="text-2xl font-bold">{stockSummary.low}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl">
          <div className="flex items-center text-red-600 mb-2">
            <Box className="mr-2" size={20} />
            <h3 className="font-semibold">Critical Stock</h3>
          </div>
          <p className="text-2xl font-bold">{stockSummary.critical}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center text-gray-600 mb-2">
            <ShoppingBag className="mr-2" size={20} />
            <h3 className="font-semibold">Out of Stock</h3>
          </div>
          <p className="text-2xl font-bold">{stockSummary.outOfStock}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl">
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.platform}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {item.stock}
                      </span>
                      <span
                        className={`flex items-center ${
                          item.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.trend === "up" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                        <span className="text-xs ml-1">
                          {Math.abs(item.change)}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        item.status === "healthy"
                          ? "bg-green-100 text-green-800"
                          : item.status === "low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
