import { CircularProgress, Grid } from "@mui/material";
import { AircraftCard } from "./AircraftCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";

export const AircraftList = () => {
  const { data, isLoading, error } = useFetchAircrafts();

  if (isLoading) return <CircularProgress />;

  if (error) return <div>Error loading aircraft</div>;

  return (
    <Grid container spacing={2}>
      {data?.map((aircraft) => (
        <Grid size={{ xs: 12, md: 6 }} key={aircraft.id}>
          <AircraftCard aircraft={aircraft} />
        </Grid>
      ))}
    </Grid>
  );
};
