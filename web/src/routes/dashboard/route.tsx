import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Outlet,
  async beforeLoad({ context: { authenticated } }) {
    if (!authenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
});
