import { createContext, useContext, useState } from "react";

type FavoritesContextValue = {
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FavoritesContex = createContext<FavoritesContextValue | null>(
  null,
);

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const value = { favorites, setFavorites };

  return (
    <FavoritesContex.Provider value={value}>
      {children}
    </FavoritesContex.Provider>
  );
};

const useFavorites = () => {
  const context = useContext(FavoritesContex);
  if (context === null) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return [context.favorites, context.setFavorites] as const;
};

export { FavoritesProvider, useFavorites };
