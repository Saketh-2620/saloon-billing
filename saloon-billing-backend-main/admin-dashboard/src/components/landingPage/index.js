import { useSelector } from "react-redux";
import LoginPage from "../loginPage";
import Dashboard from "../dashboard";
import ShopDetailsPage from "../shopDetailsPage";

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/shop/:shopId",
      element: <ShopDetailsPage />,
    }
  ]);

export default function LandingPage() {
    const accessToken = useSelector((state) => state.user.accessToken);
    if(accessToken === '') {
        return (
            <LoginPage />
        )
    }
    else {
        return (
            <RouterProvider router={router} />
        )
    }
}