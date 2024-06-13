import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "../utils/authenticated";
import Home from "../pages/home";

export const Route = createFileRoute("/home")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: Home
});
