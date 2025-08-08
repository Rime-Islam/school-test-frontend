import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayOut";
import NotFound from "../pages/common/NotFound";
import Home from "../pages/home/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { UserDashboard } from "../pages/user/UserDashboard";
import User from "../pages/user/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/user/dashboard",
    element: <UserDashboard/>,
    children: [
      {
        path: "/user/dashboard/user",
        element: <User />,
      },
    ],
  },
]);

export default router;
