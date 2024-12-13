import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../images/overview.png";
import "../images/inventory.png";
import "../images/analytics.png";
import "../images/platforms.png";

import {
  ArrowRight,
  Box,
  BarChart3,
  Store,
  RefreshCw,
  ArrowUp,
  AlertTriangle,
  Package,
} from "lucide-react";

interface FeatureTab {
  id: string;
  title: string;
  image: string;
  description: string;
}

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureTabs: FeatureTab[] = [
    {
      id: "overview",
      title: "Business Overview",
      image: `overview.png`,
      description:
        "Get a comprehensive view of your business with real-time metrics and performance tracking across all platforms.",
    },
    {
      id: "inventory",
      title: "Smart Inventory Management",
      image: `inventory.png`,
      description:
        "Automate your inventory management with smart stock tracking and auto-ordering capabilities across TikTok, Instagram, and Shopify.",
    },
    {
      id: "analytics",
      title: "Performance Analytics",
      image: `analytics.png`,
      description:
        "Track product performance with detailed analytics including views, engagement, and sales metrics for data-driven decisions.",
    },
    {
      id: "platforms",
      title: "Platform Integration",
      image: `platforms.png`,
      description:
        "Seamlessly connect and manage your TikTok, Instagram, and Shopify stores with real-time synchronization.",
    },
  ];

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full bg-white/90 backdrop-blur-sm z-40 border-b"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-blue-600">KwikSync</span>
              <div className="hidden md:flex space-x-6">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
                <a href="#demo" className="text-gray-600 hover:text-gray-900">
                  Demo
                </a>
              </div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <img
                src="/images/google-icon.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Manage Your E-commerce Empire From One Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Synchronize inventory, track performance, and boost sales across
                TikTok, Instagram, and Shopify - all in real-time.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  See How It Works
                </button>
              </div>
            </div>
            <div className="rounded-xl shadow-xl overflow-hidden">
              <img
                src="/overview.png"
                alt="KwikSync Dashboard"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to manage your multi-platform business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16">
            {featureTabs.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                }`}
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full rounded-lg border"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to streamline your e-commerce business?
          </h2>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 mx-auto"
          >
            <img
              src="/images/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Get Started with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
