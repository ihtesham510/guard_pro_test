import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const createRouter = () => {
  const queryClient = new QueryClient();

  const router = createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
