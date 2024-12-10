import React, { useState } from "react";
import { Layers, Link2, Package, TrendingUp, RefreshCw } from "lucide-react";
import {
  OverviewView,
  PlatformsView,
  InventoryView,
  ProductAnalytics,
} from "./web/components";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewView />;
      case "platforms":
        return <PlatformsView />;
      case "inventory":
        return <InventoryView />;
      case "analytics":
        return <ProductAnalytics />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
          <div className="flex border-b pb-2 mb-4 space-x-4 items-center justify-between">
            <div className="flex space-x-4">
              {[
                { key: "overview", icon: Layers, label: "Overview" },
                { key: "inventory", icon: Package, label: "Inventory" },
                { key: "analytics", icon: TrendingUp, label: "Analytics" },
                { key: "platforms", icon: Link2, label: "Platforms" },
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

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
