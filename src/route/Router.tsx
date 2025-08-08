import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayOut";
import NotFound from "../pages/common/NotFound";
import Home from "../pages/home/Home";

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
    ],
  },
]);

export default router;
