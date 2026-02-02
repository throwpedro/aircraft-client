import * as React from "react";
import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/react-router";
import { AppBar, Box, Switch, Toolbar, Typography } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { useDarkMode } from "../contexts/DarkModeContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const [, setDarkMode] = useDarkMode();

  React.useEffect(() => {
    if (window.location.pathname === "/") {
      navigate({ to: "/overview" });
    }
  }, [navigate]);

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <AirplanemodeActiveIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Aircrafts</Typography>
          <Switch color="warning" onChange={() => setDarkMode((dm) => !dm)} />
          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
            <NavLink to="/overview">Aircrafts</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </React.Fragment>
  );
}

function NavLink({
  to,
  children,
}: {
  to: Parameters<typeof Link>[0]["to"];
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      activeProps={{
        style: { textDecoration: "underline" },
      }}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </Link>
  );
}
