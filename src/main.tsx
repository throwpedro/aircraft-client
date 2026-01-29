import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTheme } from "./theme.ts";
import { DialogProvider } from "./contexts/DialogContext.tsx";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <AppProviders />
      </DialogProvider>
    </QueryClientProvider>
  </StrictMode>,
);

function AppProviders() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <ThemeProvider theme={getTheme(prefersDarkMode ? "dark" : "light")}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
