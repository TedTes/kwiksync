import React, { useState } from "react";
import { Clock, Package, Truck, CheckCircle } from "lucide-react";

interface ActiveOrdersPanelProps {
  orders: Order[];
  showOrderPanel: boolean;
  setShowOrderPanel: (isShow: boolean) => void;
  handleOrderFulfillment: (
    order: Order,
    newStatus: OrderStatus,
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  ) => void;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const ActiveOrdersPanel: React.FC<ActiveOrdersPanelProps> = ({
  orders,
  showOrderPanel,
  setShowOrderPanel,
  handleOrderFulfillment,
  setInventory,
  setOrders,
}) => {
  const orderSummary = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5" />,
    confirmed: <Package className="w-5 h-5" />,
    shipped: <Truck className="w-5 h-5" />,
    delivered: <CheckCircle className="w-5 h-5" />,
  };

  const statusConfig = [
    {
      label: "Pending",
      status: "pending",
      count: orderSummary.pending,
      bgColor: "bg-amber-50",
      textColor: "text-amber-500",
    },
    {
      label: "Confirmed",
      status: "confirmed",
      count: orderSummary.confirmed,
      bgColor: "bg-blue-50",
      textColor: "text-blue-500",
    },
    {
      label: "Shipped",
      status: "shipped",
      count: orderSummary.shipped,
      bgColor: "bg-green-50",
      textColor: "text-green-500",
    },
    {
      label: "Delivered",
      status: "delivered",
      count: orderSummary.delivered,
      bgColor: "bg-gray-50",
      textColor: "text-gray-500",
    },
  ];

  const renderStatusCards = () => {
    return (
      <div className="space-y-3">
        {statusConfig.map(({ label, status, count, bgColor, textColor }) => (
          <div
            key={status}
            className={`${bgColor} p-4 rounded-lg flex items-center justify-between`}
          >
            <div className="flex items-center space-x-3">
              <span className={textColor}>
                {statusIcons[status as keyof typeof statusIcons]}
              </span>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className={`text-xl font-bold ${textColor}`}>{count}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 h-screen fixed right-0 top-0 bg-white shadow-lg p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Active Orders</h3>
        {/* <button
          onClick={() => setShowActiveOrder(!isActiveOrder)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Active Orders
        </button> */}
        <button
          onClick={() => setShowOrderPanel(!showOrderPanel)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          {showOrderPanel ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {renderStatusCards()}

      {showOrderPanel && orders.length > 0 && (
        <div className={`mt-6 border-t pt-4 space-y-3`}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 rounded-lg p-3 flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">Order {order.id}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusConfig.find((s) => s.status === order.status)
                      ?.textColor
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                SKU: {order.sku} • Qty: {order.quantity}
              </div>
              {(order.status === "confirmed" || order.status === "shipped") && (
                <button
                  onClick={() =>
                    handleOrderFulfillment(
                      order,
                      order.status === "confirmed" ? "shipped" : "delivered",
                      setInventory,
                      setOrders
                    )
                  }
                  className={`w-full py-1.5 rounded text-sm ${
                    order.status === "confirmed"
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  Mark {order.status === "confirmed" ? "Shipped" : "Delivered"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
