/// <reference types="vite/client" />
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "@/styles/app.css?url";
import { Toaster } from "sonner";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/utils/supabase";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error && !user) {
    return { authenticated: false };
  }
  return {
    authenticated: true,
    email: user?.email,
    meta_data: user?.user_metadata,
  };
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
    ],
  }),
  component: RootComponent,
  async beforeLoad() {
    const ctx = await getUser();
    return ctx;
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
