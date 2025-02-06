import React, { useState, useRef, useEffect } from "react";

import { Dashboard } from "./";
import { OnboardingView, Profile } from "../components";
import { useUserStore } from "../store";
import { toast } from "react-hot-toast";
interface User {
  id: string;
  email: string;
  isFirstLogin: boolean;
  role: string;
}

export const Home = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage("Checking user status...");

        if (!user) {
          toast.error("user not found!");
        }

        setIsFirstLogin(isFirstLogin ?? true);
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserStatus();
  }, [user]);

  return (
    <div className="w-full bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
          {isFirstLogin ? <OnboardingView /> : <Dashboard />}
        </div>
      </div>
    </div>
  );
};
