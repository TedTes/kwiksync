import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
const appServerURL = "http://localhost:3000";
export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
          navigate(
            "/login?error=missing authentication token or email, please try again"
          );
          return;
        }
        const response = await axios.get(
          `${appServerURL}/api/v1/auth/verify?token=${token}&email=${email}`
        );
        const data = await response.data;

        if (data.success) {
          localStorage.setItem("token", JSON.stringify(data.user));
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
