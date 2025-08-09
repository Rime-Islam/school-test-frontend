import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayOut";
import NotFound from "../pages/common/NotFound";
import Home from "../pages/home/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { UserDashboard } from "../pages/student/UserDashboard";
import User from "../pages/student/User";
import ChangePassword from "../components/ChangePassword";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllUsers from "../pages/admin/AllUsers";
import CreateQuestion from "../pages/admin/question/CreateQuestion";
import AllQuestion from "../pages/admin/question/AllQuestion";
import EditQuestion from "../components/question/EditQuestion";

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
    path: "/student/dashboard",
    element: <UserDashboard/>,
    children: [
      {
        path: "/student/dashboard/user",
        element: <User />,
      },
      {
        path: "/student/dashboard/change-password",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard/>,
    children: [
      {
        path: "/admin/dashboard/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/admin/dashboard/user",
        element: <AllUsers />,
      },
      {
        path: "/admin/dashboard/create-question",
        element: <CreateQuestion/>,
      },
      {
        path: "/admin/dashboard/questions",
        element: <AllQuestion />,
      },
      {
        path: "/admin/dashboard/questions/:id",
        element: <EditQuestion />,
      },
    ],
  },
]);

export default router;
