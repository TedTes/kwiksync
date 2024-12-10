import React, { useState, useEffect } from "react";
import {
  Package,
  Link2,
  TrendingUp,
  Settings,
  Layers,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  Box,
} from "lucide-react";

const initialInventory: InventoryItem[] = [
  {
    id: "TOP-001",
    product: "Summer Crop Top",
    sku: "TOP-001",
    platform: "TikTok",
    stock: 12,
    stockChange: -3,
    status: "low",
    lastUpdated: "2 mins ago",
    price: 29.99,
    platforms: {
      tiktok: { stock: 12, sales: 24, status: "active" },
      instagram: { stock: 10, sales: 15, status: "active" },
      shopify: { stock: 8, sales: 18, status: "active" },
    },
  },
  {
    id: "SHO-002",
    product: "Vintage Sneakers",
    sku: "SHO-002",
    platform: "Instagram",
    stock: 8,
    stockChange: -2,
    status: "critical",
    lastUpdated: "7 mins ago",
    price: 89.99,
    platforms: {
      tiktok: { stock: 8, sales: 12, status: "active" },
      instagram: { stock: 6, sales: 20, status: "active" },
      shopify: { stock: 5, sales: 15, status: "active" },
    },
  },
  {
    id: "JAC-003",
    product: "Denim Jacket",
    sku: "JAC-003",
    platform: "Shopify",
    stock: 45,
    stockChange: 5,
    status: "healthy",
    lastUpdated: "12 mins ago",
    price: 129.99,
    platforms: {
      tiktok: { stock: 45, sales: 30, status: "active" },
      instagram: { stock: 42, sales: 25, status: "active" },
      shopify: { stock: 40, sales: 35, status: "active" },
    },
  },
];

interface StatusBadgeProps {
  status: StatusType;
}

interface PlatformStock {
  platform: string;
  count: number;
}
interface PlatformStockProps {
  stocks: PlatformStock[];
}
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    low: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
    healthy: "bg-green-100 text-green-800",
  } as const;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export const InventoryView = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("all");
  const [showAutomationSettings, setShowAutomationSettings] = useState(false);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
  const [filteredInventory, setFilteredInventory] =
    useState<InventoryItem[]>(inventory);

  const PlatformStock: React.FC<PlatformStockProps> = ({ stocks }) => {
    const [showAll, setShowAll] = useState(false);
    const displayLimit = 2;

    const visibleStocks = showAll ? stocks : stocks.slice(0, displayLimit);
    const remainingCount = stocks.length - displayLimit;

    return (
      <div className="flex items-center space-x-1">
        {visibleStocks.map((stock, index: number) => (
          <span
            key={stock.platform}
            className="px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap"
          >
            {stock.platform}: {stock.count}
          </span>
        ))}
        {!showAll && remainingCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
          >
            +{remainingCount}
          </button>
        )}
      </div>
    );
  };
  //   // Update filtered inventory when platform selection changes
  useEffect(() => {
    if (selectedPlatform === "all") {
      setFilteredInventory(inventory);
    } else {
      // Filter and update inventory items based on selected platform
      const updated = inventory.map((item) => ({
        ...item,
        stock: item.platforms[selectedPlatform].stock,
        status: determineStatus(
          item.platforms[selectedPlatform].stock
        ) as StatusType,
        stockChange: item.platforms[selectedPlatform].sales, // Using sales as stock change for demo
      }));
      setFilteredInventory(updated);
    }
  }, [selectedPlatform, inventory]);

  // Automation settings popover
  const AutomationSettingsPopover = () => (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-medium">Auto-Order Settings</h3>
          <div className="flex items-center space-x-2">
            <span
              className={
                isAutomationEnabled ? "text-green-600" : "text-gray-400"
              }
            >
              {isAutomationEnabled ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => setIsAutomationEnabled(!isAutomationEnabled)}
              className={`
              relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full
              transition-colors duration-200 ease-in-out
              ${isAutomationEnabled ? "bg-green-500" : "bg-gray-200"}
            `}
            >
              <span
                className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out mt-0.5
                ${isAutomationEnabled ? "translate-x-4" : "translate-x-0.5"}
              `}
              />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1 text-sm"
            defaultValue={15}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Reorder Point
          </label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1 text-sm"
            defaultValue={10}
          />
        </div>
      </div>
    </div>
  );
  //   // Helper function to determine status based on stock level
  const determineStatus = (stock: number): StatusType => {
    if (stock <= 5) return "critical";
    if (stock <= 15) return "low";
    return "healthy";
  };

  //   // Calculate metrics based on filtered inventory
  const metrics = {
    totalStock: filteredInventory.reduce(
      (sum, item) =>
        selectedPlatform === "all"
          ? sum + item.stock
          : sum + item.platforms[selectedPlatform].stock,
      0
    ),
    lowStock: filteredInventory.filter((item) => item.status === "low").length,
    criticalStock: filteredInventory.filter(
      (item) => item.status === "critical"
    ).length,
    outOfStock: filteredInventory.filter((item) =>
      selectedPlatform === "all"
        ? item.stock === 0
        : item.platforms[selectedPlatform].stock === 0
    ).length,
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 text-blue-600">
          <select
            value={selectedPlatform}
            onChange={(e) =>
              setSelectedPlatform(e.target.value as PlatformType)
            }
            className="border rounded-lg px-4 py-2 text-gray-600"
          >
            <option value="all">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="shopify">Shopify</option>
          </select>

          <div className="relative">
            <button
              onClick={() => setShowAutomationSettings(!showAutomationSettings)}
              className={`
    flex items-center space-x-2 px-3 py-1.5 rounded-lg border
    ${
      isAutomationEnabled
        ? "text-green-600 border-green-200 bg-green-50"
        : "text-gray-600"
    }
  `}
            >
              <Settings size={16} />
              <span>
                Auto-Order {isAutomationEnabled ? "Active" : "Inactive"}
              </span>
            </button>
            {showAutomationSettings && <AutomationSettingsPopover />}
          </div>
        </div>
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600">
              <Box size={20} />
              <h3>Total Stock</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.totalStock}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle size={20} />
              <h3>Low Stock</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.lowStock}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle size={20} />
              <h3>Critical Stock</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.criticalStock}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Package size={20} />
              <h3>Out of Stock</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedPlatform === "all"
                    ? "Platform Stock"
                    : "Platform Details"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {item.product}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {selectedPlatform === "all"
                      ? item.platform
                      : selectedPlatform.charAt(0).toUpperCase() +
                        selectedPlatform.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium">
                        {selectedPlatform === "all"
                          ? item.stock
                          : item.platforms[selectedPlatform].stock}
                      </span>
                      <span
                        className={
                          item.stockChange > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {item.stockChange > 0 ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}
                        {Math.abs(item.stockChange)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-2" />
                      {item.lastUpdated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {selectedPlatform === "all" ? (
                      <div className="flex space-x-2">
                        <PlatformStock
                          stocks={Object.entries(item.platforms).map(
                            ([platform, data]) => {
                              return { platform, count: data.stock };
                            }
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Sales: {item.platforms[selectedPlatform].sales}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Status: {item.platforms[selectedPlatform].status}
                        </span>
                      </div>
                    )}
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
