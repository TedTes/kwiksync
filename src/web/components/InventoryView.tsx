import React, { useState, useEffect, useRef } from "react";
import { useToast } from "./";
import axios from "axios";
import {
  Package,
  Settings,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  Box,
  PlusCircle,
  Upload,
} from "lucide-react";
import {
  PlatformStock,
  ActiveOrdersPanel,
  AutoOrderSettingsPanel,
  AddInventoryItem,
  LoadingIndicator,
  BulkAddItems,
} from "./";
import { config } from "../config";

const initialInventory: InventoryItem[] = [
  {
    id: "TOP-001",
    product: "Summer Crop Top",
    sku: "TOP-001",
    platform: "tiktok",
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
    platform: "instagram",
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
    platform: "shopify",
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
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("All");
  const [showAutomationSettings, setShowAutomationSettings] = useState(false);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [isActiveOrder, setShowActiveOrder] = useState(false);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const { addToast } = useToast();
  //  useRef and useEffect for click outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showAutomationSettings) return;
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
    if (selectedPlatform === "All") {
      setFilteredInventory(inventory);
    } else {
      // Filter and update inventory items based on selected platform
      const updated = inventory.map((item) => ({
        ...item,
        stock: item.platforms[selectedPlatform].stock || 0,
        status: getItemStatus(
          item.platforms[selectedPlatform]?.stock || 0,
          settings
        ) as StatusType,
        stockChange: item.platforms[selectedPlatform]?.sales || 0, // Using sales as stock change for demo
      }));
      setFilteredInventory(updated);
    }
  }, [selectedPlatform, inventory, settings]);

  useEffect(() => {
    let mounted = true;
    async function fetchInventory() {
      try {
        const user = localStorage.getItem("user");
        if (!user) throw new Error("No user found");
        const { id } = JSON.parse(user!);
        const result = await axios.get(`${config.apiUrl}/inventory?id=${id}`);
        if (mounted && result?.data && Array.isArray(result.data)) {
          setInventory(result.data);
          setFilteredInventory(result.data);
        }
      } catch (error) {
        console.log(`error fetching inventory data:${error}`);
      }
    }
    fetchInventory();
    return () => {
      mounted = false;
    };
  }, []);
  // Monitor inventory status
  useEffect(() => {
    if (!settings.active) return;
    let mounted = true;
    const monitorInterval = setInterval(() => {
      if (!mounted) return;
      inventory.forEach((item) => {
        // Update item status based on stock levels
        // const newStatus = getItemStatus(item.stock, settings);

        // Create order if needed
        try {
          if (shouldCreateOrder(item, settings, orders)) {
            createOrder(item);
          }
        } catch (error) {
          console.error(`Error monitoring item ${item.id}:`, error);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => {
      mounted = false;
      clearInterval(monitorInterval);
    };
  }, [settings, orders, inventory]);

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
  const handleAddItem = async (newItem: Partial<InventoryItem>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/inventory/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      const savedItem = await response.json();
      setInventory((prev) => [...prev, savedItem as InventoryItem]);
      addToast("Item added successfully", "success");
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      addToast("Failed to add item. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBulkAdd = async (items: Partial<InventoryItem>[]) => {
    try {
      setIsLoading(true);

      // Process in batches of 50
      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }

      let successCount = 0;
      let failedItems: string[] = [];

      // Process each batch
      for (const batch of batches) {
        try {
          const response = await fetch("/api/v1/inventory/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: batch }),
          });

          if (!response.ok) throw new Error("Batch failed");

          const result = await response.json();
          successCount += result.successCount;
          failedItems = [...failedItems, ...result.failedItems];
        } catch (error) {
          console.error("Batch failed:", error);
          failedItems = [...failedItems, ...batch.map((item) => item.sku!)];
        }
      }

      // Show results
      if (failedItems.length === 0) {
        alert({
          title: "Success",
          description: `Successfully added ${successCount} items`,
        });
        //TODO:
        addToast(`Successfully added ${successCount} items`, "success");
      } else {
        addToast(
          `Added ${successCount} items. ${failedItems.length} items failed.`,
          "warning"
        );
      }

      // Refresh inventory
      // await fetchInventory();
    } catch (error) {
      addToast("Failed to process bulk upload", "error");
    } finally {
      setIsLoading(false);
    }
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

  // Calculate metrics based on filtered inventory
  const metrics = {
    totalStock: filteredInventory.reduce(
      (sum, item) =>
        selectedPlatform === "All"
          ? sum + item.stock
          : sum + item.platforms[selectedPlatform].stock,
      0
    ),
    lowStock: filteredInventory.filter((item) => item.status === "low").length,
    criticalStock: filteredInventory.filter(
      (item) => item.status === "critical"
    ).length,
    outOfStock: filteredInventory.filter((item) =>
      selectedPlatform === "All"
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
            <option value="All">All Platforms</option>
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
            {showAutomationSettings && (
              <AutoOrderSettingsPanel
                setSettings={setSettings}
                setIsAutomationEnabled={setIsAutomationEnabled}
                isAutomationEnabled={isAutomationEnabled}
                settings={settings}
              />
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBulkAdd(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              <Upload size={16} />
              <span>Bulk Add</span>
            </button>

            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircle size={16} />
              <span>Add Item</span>
            </button>
          </div>
        </div>
        {isLoading && <LoadingIndicator />}
        {/* Add Item Modal */}
        {showAddItem && (
          <AddInventoryItem
            onAdd={handleAddItem}
            onClose={() => setShowAddItem(false)}
          />
        )}
        {showBulkAdd && (
          <BulkAddItems
            onBulkAdd={handleBulkAdd}
            onClose={() => setShowBulkAdd(false)}
          />
        )}
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

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Detailed Order Panel */}
        {orders.length > 0 && (
          <button
            onClick={() => setShowActiveOrder(!isActiveOrder)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Show Active Orders
          </button>
        )}

        {orders.length > 0 && isActiveOrder && (
          <ActiveOrdersPanel
            orders={orders}
            showOrderPanel={showOrderPanel}
            setShowOrderPanel={setShowOrderPanel}
            handleOrderFulfillment={handleOrderFulfillment}
            setInventory={setInventory}
            setOrders={setOrders}
          />
        )}
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
                  {selectedPlatform === "All"
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
                    {selectedPlatform === "All"
                      ? item.platform
                      : selectedPlatform.charAt(0).toUpperCase() +
                        selectedPlatform.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium">
                        {selectedPlatform === "All"
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
                    {selectedPlatform === "All" ? (
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
