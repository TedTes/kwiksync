import React, { useState } from "react";
import { ShoppingBag, ArrowRight, Instagram, Video } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { api } from "../config";
import { toast } from "react-hot-toast";
import { Profile } from "./";
import axios from "axios";
export const OnboardingView = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null
  );

  const handlePlatformConnect = async (platform: string) => {
    try {
      setIsConnecting(true);
      setConnectingPlatform(platform);

      const user = localStorage.getItem("user");
      if (!user) {
        toast.error("User not found. Please log in.");
        throw new Error("User not found");
      }
      const { id } = JSON.parse(user);
      if (!id) {
        toast.error("User ID not found");
        throw new Error("User ID not found");
      }

      await api.get(
        `${api.defaults.baseURL}/auth/${platform}/connect?userId=${id}`,
        { timeout: 10000 }
      );
      // const { redirectUrl } = response.data;
      // if (redirectUrl) {
      //   window.location.href = redirectUrl;
      //   toast.success(`Redirecting to ${platform} for authentication.`);
      // } else {
      //   toast.error(`Failed to retrieve the redirect URL for ${platform}.`);
      //   throw new Error("Redirect URL is missing in the response");
      // }

      toast.success(`Successfully connected to ${platform}`);
    } catch (error) {
      console.error("Connection error:", error);

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        toast.error(`Connection timed out. Please try again.`);
      } else {
        toast.error(`Failed to connect to ${platform}.`);
      }
    } finally {
      setIsConnecting(false);
      setConnectingPlatform(null);
    }
  };

  const platforms = [
    {
      id: "shopify",
      name: "Shopify Store",
      description: "Connect your Shopify products and orders",
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      bgColor: "bg-[#96BF47]",
      comingSoon: false,
    },
    {
      id: "tiktok",
      name: "TikTok Shop",
      description: "Sync your TikTok shop products and orders",
      icon: <Video className="w-6 h-6 text-white" />,
      bgColor: "bg-[#000000]",
      comingSoon: false,
    },
    {
      id: "instagram",
      name: "Instagram Shop",
      description: "Connect your Instagram shopping catalog",
      icon: <Instagram className="w-6 h-6 text-white" />,
      bgColor: "bg-[#E4405F]",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 ">
        <div className="flex justify-end mb-8">
          {" "}
          <Profile />
        </div>
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to KwikSync
          </h1>
          <p className="text-lg text-gray-600">
            Connect your e-commerce platforms to get started
          </p>
        </div>

        {/* Platform Connection Options */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid gap-6">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() =>
                  !platform.comingSoon && handlePlatformConnect(platform.id)
                }
                disabled={isConnecting || platform.comingSoon}
                className={`
                  w-full p-6 border-2 rounded-lg transition-all
                  ${
                    platform.comingSoon
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${platform.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      {platform.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={`text-lg font-semibold ${
                            platform.comingSoon
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {platform.name}
                        </h3>
                        {platform.comingSoon && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          platform.comingSoon
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {platform.description}
                      </p>
                    </div>
                  </div>
                  {connectingPlatform === platform.id ? (
                    <LoadingSpinner size="small" color="blue" />
                  ) : (
                    !platform.comingSoon && (
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    )
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Need help getting started?
                </h4>
                <p className="text-sm text-gray-500">
                  Our support team is here to help you set up your platforms
                </p>
              </div>
              <div className="flex space-x-4">
                <a
                  href="/docs/getting-started"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Guide
                </a>
                <a
                  href="/support"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status Toast */}
        {isConnecting && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <LoadingSpinner size="small" color="blue" />
            <span className="text-sm text-gray-600">
              Connecting to {connectingPlatform}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
