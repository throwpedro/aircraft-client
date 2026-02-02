import { createContext, useContext, useState } from "react";

type DarkModeContextValue = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DarkModeContext = createContext<DarkModeContextValue | null>(
  null,
);

const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const value = { darkMode, setDarkMode };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === null) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return [context.darkMode, context.setDarkMode] as const;
};

export { DarkModeProvider, useDarkMode };
