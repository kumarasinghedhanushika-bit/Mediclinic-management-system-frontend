import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages/HomePage";
import ChannelingPage from "../pages/ChannelingPage";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/frogotPassword";
import ResetPassword from "../pages/resetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import Dashboard from "../pages/Dashboard";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";
import OAuth2CallbackPage from "../pages/OAuth2CallbackPage";
import AboutUs from "../pages/aboutus";
import AllService from "../pages/allservice";
import DocCard from "../pages/doccard";



const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/channeling", element: <ChannelingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/verify-email/:token", element: <VerifyEmail /> },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/cancel", element: <PaymentCancel /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/oauth2/callback", element: <OAuth2CallbackPage /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/allservice", element: <AllService /> },
      { path: "/doccard", element: <DocCard /> }

    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
