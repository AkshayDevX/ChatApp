import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import useGetLoginUserQuery from "../actions/user/getUserProfile";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: () => {
    const { isError } = useGetLoginUserQuery();
    const navigate= useNavigate();

    useEffect(() => {
      if (isError && localStorage.getItem("chatAppUser")) {
        localStorage.removeItem("chatAppUser");
        navigate({to: "/"});
      }
    }, [isError]);
    

    return (
      <>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});
