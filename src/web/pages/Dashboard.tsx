import React, { useRef, useState } from "react";
import {
  Layers,
  Link2,
  Package,
  TrendingUp,
  RefreshCw,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  OverviewView,
  PlatformsView,
  InventoryView,
  ProductAnalytics,
  Profile,
} from "../components";

interface User {
  id: string;
  email: string;
  isFirstLogin: boolean;
  role: string;
}

export const Dashboard = () => {
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white   space-y-6">
          <div className="flex flex-col border-b pb-2 mb-4">
            <div className="flex items-center justify-between">
              {
                <div className="flex items-center">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 mr-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                  <div className="hidden lg:flex space-x-4">
                    {[
                      { key: "overview", icon: Layers, label: "Overview" },
                      { key: "inventory", icon: Package, label: "Inventory" },
                      {
                        key: "analytics",
                        icon: TrendingUp,
                        label: "Analytics",
                      },
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
                </div>
              }

              {/* User Profile Dropdown */}
              <Profile />
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-4 border-t pt-4">
                <nav className="flex flex-col space-y-1">
                  {[
                    { key: "overview", icon: Layers, label: "Overview" },
                    { key: "inventory", icon: Package, label: "Inventory" },
                    { key: "analytics", icon: TrendingUp, label: "Analytics" },
                    { key: "platforms", icon: Link2, label: "Platforms" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center space-x-2 p-3 rounded-lg transition-colors w-full text-left
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
                </nav>
              </div>
            )}
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
