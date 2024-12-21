import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Shield, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const Login: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const appServerURL = "http://localhost:3000";
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await sendMagicLink(email);

      setSuccess(
        "A login link has been sent to your email. Please check your inbox."
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send login link. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string) => {
    const response = await axios.post(
      `${appServerURL}/api/v1/auth/magic-link`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.data) {
      const data = await response.data;
      throw new Error(data.message || "Failed to send magic link");
    }

    return response.data;
  };

  const handleReturnToLanding = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden relative"
      >
        {/* Navigation Buttons */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {/* Return to Landing Page */}
          <button
            onClick={handleReturnToLanding}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center relative mb-10">
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-1 bg-blue-600 rounded-full mr-3"></div>
              <div className="w-16 h-1 bg-blue-300 rounded-full"></div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                KwikSync
              </span>{" "}
              Login
            </h2>

            <p className="text-gray-600 mt-2 text-base max-w-md mx-auto">
              Access your intelligent business management platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center"
            >
              <Shield className="w-6 h-6 mr-3 text-red-500" />
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center"
            >
              <Check className="w-6 h-6 mr-3 text-green-500" />
              {success}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="pl-10 block w-full py-3.5 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                required
                disabled={isLoading || !!success}
              />
            </div>

            {!success && (
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-3.5 ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }text-white rounded-lg transition`}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Login Link <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </form>

          <div className="mt-6">
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="/images/google-icon.png"
                alt="Google"
                className="w-6 h-6 mr-3"
              />
              <span className="font-medium text-gray-700">
                Continue with Google
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
