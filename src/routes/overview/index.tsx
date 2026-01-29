import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import AddIcon from "@mui/icons-material/Add";
import { AircraftList } from "../../features/overview/AircraftList";
import {
  useCreateAircraft,
  useFetchAircrafts,
  useUpdateAircraft,
} from "../../hooks/aircrafts";
import { CreateAircraftDialog } from "../../features/overview/CreateAircraftDialog";
import { useQueryClient } from "@tanstack/react-query";
import { type Aircraft } from "../../api/aircrafts";
import { AircraftIdProvider } from "../../contexts/AircraftIdContext";
import { useDialogOpen } from "../../contexts/DialogContext";
import { useState } from "react";

export const Route = createFileRoute("/overview/")({
  component: RouteComponent,
});

type CreatePayload = {
  mode: "create";
  aircraft: Omit<Aircraft, "id">;
};

type UpdatePayload = {
  mode: "update";
  aircraft: Aircraft;
};

export type SubmitPayload = CreatePayload | UpdatePayload;

function RouteComponent() {
  const [, setOpen] = useDialogOpen();
  const queryClient = useQueryClient();
  const aircrafts = useFetchAircrafts().data;

  const createAircraftQuery = useCreateAircraft({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["allAircrafts"] });
    },
  });

  const updateAircraftMutation = useUpdateAircraft({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["allAircrafts"] });
    },
    onError: (error) => {
      console.error("Error updating aircraft:", error);
    },
  });

  const handleSubmit = (payload: SubmitPayload) => {
    if (payload.mode === "update") {
      updateAircraftMutation.mutate(payload.aircraft);
    } else if (payload.mode === "create") {
      createAircraftQuery.mutate(payload.aircraft);
    }
  };

  return (
    <AircraftIdProvider>
      <Stack sx={{ display: "flex", p: 4 }}>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Aircrafts
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            variant="contained"
          >
            <Typography variant="button">add new</Typography>
          </Button>
          <CreateAircraftDialog
            handleClose={() => setOpen(false)}
            handleSubmit={handleSubmit}
            loading={
              updateAircraftMutation.isPending || createAircraftQuery.isPending
            }
          />
        </Box>
        <Box>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={aircrafts?.map((aircraft) => aircraft.tailNumber) || []}
            renderInput={(params) => (
              <TextField {...params} label="search..." />
            )}
            sx={{ mb: 2 }}
          />
        </Box>
        <AircraftList />
      </Stack>
    </AircraftIdProvider>
  );
}
