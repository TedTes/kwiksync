import React, { useState, useEffect, useRef } from "react";
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
  Building2,
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
const suppliers: Record<string, SupplierInfo> = {
  "SUP-1": {
    id: "SUP-1",
    name: "Fashion Wholesale Co",
    price: 12.99,
    leadTime: 5,
    reliability: 0.95,
    minOrderQuantity: 100,
  },
  "SUP-2": {
    id: "SUP-2",
    name: "Textile Direct",
    price: 14.99,
    leadTime: 7,
    reliability: 0.98,
    minOrderQuantity: 50,
  },
};

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
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<AutoOrderSettings>({
    active: true,
    lowStockThreshold: 15,
    reorderPoint: 10,
    primarySupplier: "SUP-1",
    secondarySupplier: "SUP-2",
    selectionCriteria: "auto",
  });

  //  useRef and useEffect for click outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showAutomationSettings) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowAutomationSettings(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showAutomationSettings]);

  // Update filtered inventory when platform selection changes
  useEffect(() => {
    if (selectedPlatform === "all") {
      setFilteredInventory(inventory);
    } else {
      // Filter and update inventory items based on selected platform
      const updated = inventory.map((item) => ({
        ...item,
        stock: item.platforms[selectedPlatform].stock,
        status: getItemStatus(
          item.platforms[selectedPlatform].stock,
          settings
        ) as StatusType,
        stockChange: item.platforms[selectedPlatform].sales, // Using sales as stock change for demo
      }));
      setFilteredInventory(updated);
    }
  }, [selectedPlatform, inventory]);
  // Monitor inventory status
  useEffect(() => {
    if (!settings.active) return;

    const monitorInterval = setInterval(() => {
      inventory.forEach((item) => {
        // Update item status based on stock levels
        // const newStatus = getItemStatus(item.stock, settings);

        // Create order if needed
        if (shouldCreateOrder(item, settings, orders)) {
          createOrder(item);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(monitorInterval);
  }, [inventory, settings, orders]);

  const getStatusColor = (status: OrderStatus): string => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-green-100 text-green-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      delayed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const orderSummary = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const updateInventoryFromOrder = (
    inventory: InventoryItem[],
    order: OrderUpdate
  ): InventoryItem[] => {
    return inventory.map((item) => {
      if (item.sku === order.sku) {
        // Calculate total sales across all platforms
        const totalSales = Object.values(item.platforms).reduce(
          (sum, platform) => sum + platform.sales,
          0
        );
        // Update stock across all platforms
        const updatedPlatforms = {
          tiktok: {
            ...item.platforms.tiktok,
            stock: Math.floor(
              item.platforms.tiktok.stock +
                order.quantity * (item.platforms.tiktok.sales / totalSales)
            ),
          },
          instagram: {
            ...item.platforms.instagram,
            stock: Math.floor(
              item.platforms.instagram.stock +
                order.quantity * (item.platforms.instagram.sales / totalSales)
            ),
          },
          shopify: {
            ...item.platforms.shopify,
            stock: Math.floor(
              item.platforms.shopify.stock +
                order.quantity * (item.platforms.shopify.sales / totalSales)
            ),
          },
        };

        // Calculate total new stock
        const newTotalStock = Object.values(updatedPlatforms).reduce(
          (sum, platform) => sum + platform.stock,
          0
        );
        return {
          ...item,
          stock: newTotalStock,
          status: getItemStatus(newTotalStock, settings),
          lastUpdated: "Just now",
          platforms: updatedPlatforms,
          // Update stockChange to reflect the order quantity
          stockChange: order.quantity,
        };
      }
      return item;
    });
  };

  const handleOrderFulfillment = (
    order: Order,
    newStatus: OrderStatus,
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  ) => {
    // Update order status
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );

    // If order is delivered, update inventory
    if (newStatus === "delivered") {
      setInventory((prevInventory) =>
        updateInventoryFromOrder(prevInventory, {
          id: order.id,
          status: newStatus,
          quantity: order.quantity,
          sku: order.sku,
        })
      );
    }
  };

  const shouldCreateOrder = (
    item: InventoryItem,
    settings: AutoOrderSettings,
    existingOrders: Order[]
  ): boolean => {
    // Check if there's already an active order
    const hasActiveOrder = existingOrders.some(
      (order) =>
        order.sku === item.sku &&
        ["pending", "confirmed"].includes(order.status)
    );

    // Status-based ordering logic
    const needsOrder =
      // Critical status - immediate order if below reorderPoint
      (item.status === "critical" && item.stock <= settings.reorderPoint) ||
      // Low status - order when stock hits reorderPoint
      (item.status === "low" && item.stock <= settings.reorderPoint) ||
      // Any status - emergency order if stock is zero
      item.stock === 0;

    return settings.active && needsOrder && !hasActiveOrder;
  };

  const getItemStatus = (
    stock: number,
    settings: AutoOrderSettings
  ): "healthy" | "low" | "critical" => {
    if (stock <= settings.reorderPoint) return "critical";
    if (stock <= settings.lowStockThreshold) return "low";
    return "healthy";
  };

  const selectSupplier = (item: InventoryItem): SupplierInfo => {
    const primary = suppliers[settings.primarySupplier];
    const secondary = suppliers[settings.secondarySupplier];

    if (settings.selectionCriteria === "auto") {
      // Weighted scoring system
      const scoreSupplier = (supplier: SupplierInfo) => {
        return (
          supplier.reliability * 0.4 +
          (1 - supplier.price / 20) * 0.3 +
          (1 - supplier.leadTime / 10) * 0.3
        );
      };

      const primaryScore = scoreSupplier(primary);
      const secondaryScore = scoreSupplier(secondary);

      return primaryScore >= secondaryScore ? primary : secondary;
    }

    // Direct criteria selection
    switch (settings.selectionCriteria) {
      case "price":
        return primary.price <= secondary.price ? primary : secondary;
      case "leadTime":
        return primary.leadTime <= secondary.leadTime ? primary : secondary;
      case "reliability":
        return primary.reliability >= secondary.reliability
          ? primary
          : secondary;
      default:
        return primary;
    }
  };
  const createOrder = (item: InventoryItem) => {
    const supplier = selectSupplier(item);
    const quantity = Math.max(
      supplier.minOrderQuantity,
      50 - item.stock // Order up to 50 units
    );

    const newOrder: Order = {
      id: `PO-${Math.random().toString(36).substr(2, 9)}`,
      sku: item.sku,
      supplier: supplier.id,
      quantity,
      status: "pending",
      createdAt: new Date(),
      estimatedDelivery: new Date(
        Date.now() + supplier.leadTime * 24 * 60 * 60 * 1000
      ),
    };

    setOrders((prev) => [...prev, newOrder]);

    // Simulate order confirmation
    // setTimeout(() => {
    //   setOrders((prev) =>
    //     prev.map((order) =>
    //       order.id === newOrder.id ? { ...order, status: "confirmed" } : order
    //     )
    //   );
    // }, 2000);
  };
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

  const AutoOrderSettingsPanel = () => {
    return (
      <div className="absolute left-0 top-full mt-2 w-[400px] p-4 bg-white rounded-lg shadow-lg z-50 border space-y-4">
        {/* Existing settings */}
        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-medium">Auto-Order Settings</span>
          <div className="flex items-center space-x-2">
            <span>Active</span>

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

        {/* Thresholds */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  lowStockThreshold: parseInt(e.target.value),
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              value={settings.reorderPoint}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  reorderPoint: parseInt(e.target.value),
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Supplier Preferences - New Section */}
        <div className="space-y-3 pt-2 border-t">
          <h3 className="font-medium flex items-center">
            <Building2 size={16} className="mr-2" />
            Supplier Preferences
          </h3>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Primary Supplier
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={settings.primarySupplier}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  primarySupplier: e.target.value,
                }))
              }
            >
              <option value="SUP-1">Fashion Wholesale Co</option>
              <option value="SUP-2">Textile Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Secondary Supplier (Backup)
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={settings.secondarySupplier}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  secondarySupplier: e.target.value,
                }))
              }
            >
              <option value="SUP-1">Fashion Wholesale Co</option>
              <option value="SUP-2">Textile Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Selection Criteria
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={settings.selectionCriteria}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  selectionCriteria: e.target.value as
                    | "price"
                    | "leadTime"
                    | "reliability"
                    | "auto",
                }))
              }
            >
              <option value="auto">Automatic (Best Available)</option>
              <option value="price">Lowest Price</option>
              <option value="leadTime">Fastest Delivery</option>
              <option value="reliability">Most Reliable</option>
            </select>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">
              When set to "Automatic", the system will choose the best supplier
              based on:
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Current stock levels</li>
                <li>Supplier availability</li>
                <li>Price and lead time</li>
                <li>Historical reliability</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Calculate metrics based on filtered inventory
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
        <div className="flex items-center space-x-2 text-blue-600 relative">
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

          <div className="relative" ref={dropdownRef}>
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
            {showAutomationSettings && <AutoOrderSettingsPanel />}
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
      {/* Order Status Panel */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Orders</h3>
            <button
              onClick={() => setShowOrderPanel(!showOrderPanel)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showOrderPanel ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-yellow-500">
                {orderSummary.pending}
              </span>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-500">
                {orderSummary.confirmed}
              </span>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-500">
                {orderSummary.shipped}
              </span>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-700">
                {orderSummary.delivered}
              </span>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>

          {/* Detailed Order Panel */}
          {showOrderPanel && (
            <div className="border-t pt-4">
              {orders.map((order) => (
                <div key={order.id} className="border-b last:border-b-0 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Order {order.id}</span>
                      <p className="text-sm text-gray-500">
                        SKU: {order.sku} • Quantity: {order.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      {order.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleOrderFulfillment(
                              order,
                              "shipped",
                              setInventory,
                              setOrders
                            )
                          }
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button
                          onClick={() =>
                            handleOrderFulfillment(
                              order,
                              "delivered",
                              setInventory,
                              setOrders
                            )
                          }
                          className="px-3 py-1 bg-green-50 text-green-600 rounded-lg"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
