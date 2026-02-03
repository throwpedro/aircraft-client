import { CircularProgress, Grid } from "@mui/material";
import { AircraftCard } from "./AircraftCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";
import { useMemo } from "react";
import type { AircraftFilter } from "./AircraftFilterPanel";
import { useFavorites } from "../../contexts/FavoritesContext";

export const AircraftList = ({
  searchQuery,
  filters,
}: {
  searchQuery: string;
  filters: AircraftFilter;
}) => {
  const { data, isLoading, error } = useFetchAircrafts();
  const [favorites, setFavorites] = useFavorites();

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((aircraft) => {
      const seatMatch =
        (filters.minSeats === undefined ||
          aircraft.numberOfSeats >= filters.minSeats) &&
        (filters.maxSeats === undefined ||
          aircraft.numberOfSeats <= filters.maxSeats);

      const conditionMatch =
        (filters.minInteriorCondition === undefined ||
          aircraft.interiorCondition >= filters.minInteriorCondition) &&
        (filters.maxInteriorCondition === undefined ||
          aircraft.interiorCondition <= filters.maxInteriorCondition);

      const petsMatch =
        filters.suitedForPets === undefined ||
        aircraft.isSuitedForPets === filters.suitedForPets;

      const searchMatch =
        aircraft.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aircraft.aircraftType.toLowerCase().includes(searchQuery.toLowerCase());

      return seatMatch && conditionMatch && petsMatch && searchMatch;
    });
  }, [data, filters, searchQuery]);

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites((favs) => favs.filter((fav) => fav !== id));
    } else {
      setFavorites((favorites) => {
        return [...favorites, id];
      });
    }
  };

  if (isLoading) return <CircularProgress />;

  if (error) return <div>Error loading aircraft</div>;

  return (
    <Grid container spacing={2}>
      {filteredData.map((aircraft) => (
        <Grid size={{ xs: 12, md: 6 }} key={aircraft.id}>
          <AircraftCard
            aircraft={aircraft}
            isFavorite={favorites.includes(aircraft.id)}
            toggleFavorite={handleToggleFavorite}
          />
        </Grid>
      ))}
    </Grid>
  );
};
