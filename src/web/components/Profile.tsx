import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../config";
import { RefreshCw, User, LogOut } from "lucide-react";
import { useUserStore } from "../store";
export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = async () => {
    try {
      if (!user) throw new Error("User data not found");

      await api.post(`/auth/logout`, { userEmail: user.email });
      clearUser();
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login");
    }
  };

  const handleUpdatePhoto = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setIsUploadingPhoto(true);

      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.post(`/api/v1/users/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.photoUrl) {
        // TODO: Update user's photo URL in local storage or state
        console.log("Photo updated successfully");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSync = () => {
    console.log("Syncing data...");
  };

  return (
    user && (
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          className="flex items-center space-x-3 px-3 py-2 transition-colors md:px-4"
          onClick={toggleDropdown}
        >
          <div className="relative flex-shrink-0">
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-100"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div className="flex items-center space-x-2 hidden sm:flex">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-700">
                {user.name}
              </span>
              <span className="text-xs text-gray-500">{user.role}</span>
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
              <p className="text-sm font-medium text-gray-700">Signed in as</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <button
                onClick={handleSync}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <RefreshCw size={16} className="text-gray-400" />
                <span>Sync Now</span>
              </button>

              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpdatePhoto}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User size={16} className="text-gray-400" />
                  <span>
                    {isUploadingPhoto ? "Uploading..." : "Update Photo"}
                  </span>
                  {isUploadingPhoto && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                </button>
              </>

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
    )
  );
};
