import { createFileRoute } from "@tanstack/react-router";
import { useFavorites } from "../../contexts/FavoritesContext";
import { AircraftCard } from "../../features/overview/AircraftCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";
import { Box, Stack, Typography } from "@mui/material";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [favorites, setFavorites] = useFavorites();

  const { data } = useFetchAircrafts();

  const handleFavoriteToggle = (id: string) => {
    setFavorites((favs) => favs.filter((favId) => favId !== id));
  }

  return (
    <Stack p={4}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Favorites
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {data?.map((d) => {
          if (favorites.includes(d.id)) {
            return (
              <AircraftCard
                key={d.id}
                aircraft={d}
                toggleFavorite={handleFavoriteToggle}
                isFavorite={favorites.includes(d.id)}
              />
            );
          }
        })}
      </Box>
    </Stack>
  );
}
