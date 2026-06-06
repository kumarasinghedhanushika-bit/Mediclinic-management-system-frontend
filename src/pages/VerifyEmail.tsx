import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../api";


export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        await authService.verifyEmail(token);

        setSuccess(true);
        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Verification failed or link expired"
        );
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">

        {loading && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Verifying your email...
            </p>
          </>
        )}

        {!loading && success && (
          <>
            <div className="text-green-500 text-5xl">✔</div>
            <h2 className="text-xl font-bold mt-4">
              Email Verified
            </h2>
            <p className="text-gray-600 mt-2">
              Redirecting to login...
            </p>
          </>
        )}

        {!loading && !success && (
          <>
            <div className="text-red-500 text-5xl">✖</div>
            <h2 className="text-xl font-bold mt-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">
              The link is invalid or expired.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}