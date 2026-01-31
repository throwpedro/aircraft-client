import { CircularProgress, Grid } from "@mui/material";
import { AircraftCard } from "./AircraftCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";
import { useMemo } from "react";
import type { AircraftFilter } from "./AircraftFilterPanel";

export const AircraftList = ({
  searchQuery,
  filters,
}: {
  searchQuery: string;
  filters: AircraftFilter;
}) => {
  const { data, isLoading, error } = useFetchAircrafts();

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

  // const searchData = useMemo(() => {
  //   if (!data) {
  //     return [];
  //   }
  //   return data.filter((d) => {
  //     return (
  //       d.tailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       d.aircraftType.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });
  // }, [data, searchQuery]);

  if (isLoading) return <CircularProgress />;

  if (error) return <div>Error loading aircraft</div>;

  return (
    <Grid container spacing={2}>
      {filteredData.map((aircraft) => (
        <Grid size={{ xs: 12, md: 6 }} key={aircraft.id}>
          <AircraftCard aircraft={aircraft} />
        </Grid>
      ))}
    </Grid>
  );
};
