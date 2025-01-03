import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layers,
  Link2,
  Package,
  TrendingUp,
  RefreshCw,
  User,
  LogOut,
} from "lucide-react";
import {
  OverviewView,
  PlatformsView,
  InventoryView,
  ProductAnalytics,
} from "../components";
import { use } from "passport";
const webAppServer = "http://localhost:3000";

interface User {
  email: string;
  role: string;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        throw new Error("User data not found");
      }
      const userData = JSON.parse(user) as User;
      const userEmail = userData.email;
      const response = await axios.post(`${webAppServer}/api/v1/auth/logout`, {
        userEmail,
      });

      if (!response.data) {
        throw new Error("Logout failed");
      }
      sessionStorage.clear();
      localStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login");
    }
  };

  const handleUpdatePhoto = () => {
    console.log("Updating photo...");
  };

  const handleSync = () => {
    console.log("Syncing data...");
  };

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

            {/* Avatar Dropdown */}
            <div className="relative ml-auto" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 px-3 py-2 transition-colors md:px-4"
                onClick={toggleDropdown}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div className="flex items-center space-x-2 hidden sm:flex">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      John Doe
                    </span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <RefreshCw
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      john.doe@kwiksync.com
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleSync}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <RefreshCw size={16} className="text-gray-400" />
                      <span>Sync Now</span>
                    </button>

                    <button
                      onClick={handleUpdatePhoto}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User size={16} className="text-gray-400" />
                      <span>Update Photo</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
