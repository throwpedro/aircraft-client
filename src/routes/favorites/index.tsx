import { createFileRoute } from "@tanstack/react-router";
import { useFavorites } from "../../contexts/FavoritesContext";
import { AircraftCard } from "../../features/overview/AircraftCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";
import { Box, Stack } from "@mui/material";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [favorites, setFavorites] = useFavorites();

  const { data } = useFetchAircrafts();

  return (
    <Stack>
      <Box display="flex" flexDirection="column" gap={2} mt={2} p={2}>
        {data?.map((d) => {
          if (favorites.includes(d.id)) {
            return (
              <AircraftCard
                key={d.id}
                aircraft={d}
                toggleFavorite={() => {}}
                isFavorite={favorites.includes(d.id)}
              />
            );
          }
        })}
      </Box>
    </Stack>
  );
}
