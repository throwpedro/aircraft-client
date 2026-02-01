import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTheme } from "./theme.ts";
import { DialogProvider } from "./contexts/DialogContext.tsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.tsx";
import { AircraftIdProvider } from "./contexts/AircraftIdContext.tsx";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);

function AppProviders() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <AircraftIdProvider>
          <DialogProvider>
            <ThemeProvider theme={getTheme(prefersDarkMode ? "dark" : "light")}>
              <CssBaseline />
              <RouterProvider router={router} />
            </ThemeProvider>
          </DialogProvider>
        </AircraftIdProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
