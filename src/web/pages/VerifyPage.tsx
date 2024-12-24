import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
          navigate("/login?error=missing_params");
          return;
        }

        const response = await fetch(
          `/api/v1/auth/verify?token=${token}&email=${email}`
        );
        const data = await response.json();

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          navigate("/login?error=invalid_link");
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

export default VerifyPage;
