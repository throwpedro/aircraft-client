// theme.ts
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "light" ? "#f7f8fa" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
  });
