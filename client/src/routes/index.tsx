import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "../pages/auth/login";
import isAuthenticated from "../utils/authenticated";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/home" });
    }
  },
  component: Login,
});
