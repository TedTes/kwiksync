import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../config";

export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const existingUser = localStorage.getItem("user");
        if (existingUser) {
          navigate("/dashboard");
          return;
        }
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
          navigate(
            "/login?error=missing authentication token or email, please try again"
          );
          return;
        }
        const response = await api.get(
          `/auth/verify?token=${token}&email=${email}`
        );
        const data = await response.data;

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          navigate("/login?error=The link is invalid or expired");
        }
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/login?error=verification_failed");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Verifying your login...</p>
        </div>
      </div>
    );
  }

  return null;
};
