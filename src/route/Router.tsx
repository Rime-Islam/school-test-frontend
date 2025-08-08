import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayOut";
import NotFound from "../pages/common/NotFound";
import Home from "../pages/home/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";

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
    ],
  },
]);

export default router;
