import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    // ❌ Error case
    if (error) {
      toast.error("Google sign-in failed: " + error);
      navigate("/login", { replace: true });
      return;
    }

    // ❌ No token
    if (!token) {
      toast.error("Sign-in failed — no token received");
      navigate("/login", { replace: true });
      return;
    }

    // ✅ Save data
    // ✅ Save data (FIXED)
localStorage.setItem("token", token);

if (email) localStorage.setItem("email", email);
if (role) localStorage.setItem("role", role);

    toast.success("Signed in with Google");

    navigate("/dashboard", { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Completing sign-in...</p>
    </div>
  );
}