import { Stack, Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardCard } from "../../features/dashboard/DashboardCard";
import { useFetchAircrafts } from "../../hooks/aircrafts";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import BuildIcon from "@mui/icons-material/Build";
import PetsIcon from "@mui/icons-material/Pets";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import dayjs from "dayjs";
import type { Aircraft } from "../../api/aircrafts";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useFetchAircrafts();
  const maintenanceDue = data?.filter((d) => {
    const nextDate = dayjs(d.nextMaintenanceDate);
    const today = dayjs();
    const in7Days = today.add(7, "day");

    return (
      nextDate.isAfter(today.subtract(1, "day")) &&
      nextDate.isBefore(in7Days.add(1, "day"))
    );
  });

  const suitedForPets = data?.filter((d) => {
    return !!d.isSuitedForPets;
  });

  const condition = data?.reduce(
    (acc, d) => {
      if (d.interiorCondition >= 0.5) {
        acc.good.push(d);
      } else {
        acc.bad.push(d);
      }
      return acc;
    },
    { good: [], bad: [] } as {
      good: Aircraft[];
      bad: Aircraft[];
    },
  );

  return (
    <Stack sx={{ display: "flex", p: 4, gap: 2 }}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
      </Box>
      <DashboardCard
        title="Total Aircrafts"
        displayData={(data?.length ?? 0).toString()}
        icon={FlightTakeoffIcon}
        color="primary"
      />
      <DashboardCard
        title="Maintenance Due In The Next 7 Days"
        displayData={(maintenanceDue?.length ?? 0).toString()}
        icon={BuildIcon}
        color="error"
      />
      <DashboardCard
        title="Pet Friendly"
        displayData={(suitedForPets?.length ?? "N/A").toString()}
        icon={PetsIcon}
        color="info"
      />
      <DashboardCard
        title="Good Condition"
        displayData={(condition?.good?.length ?? "N/A").toString()}
        icon={QueryStatsIcon}
        color="success"
      />
      <DashboardCard
        title="Bad Condition"
        displayData={(condition?.bad?.length ?? "N/A").toString()}
        icon={QueryStatsIcon}
        color="warning"
      />
    </Stack>
  );
}
