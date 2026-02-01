import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  type AlertProps,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import AddIcon from "@mui/icons-material/Add";
import { AircraftList } from "../../features/overview/AircraftList";
import { useCreateAircraft, useUpdateAircraft } from "../../hooks/aircrafts";
import { CreateAircraftDialog } from "../../features/overview/CreateAircraftDialog";
import { useQueryClient } from "@tanstack/react-query";
import { type Aircraft } from "../../api/aircrafts";
import { AircraftIdProvider } from "../../contexts/AircraftIdContext";
import { useDialogOpen } from "../../contexts/DialogContext";
import { useState } from "react";
import {
  AircraftFilterPanel,
  type AircraftFilter,
} from "../../features/overview/AircraftFilterPanel";

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
  const [snackbarState, setSnackbarState] = useState<{
    isOpen: boolean;
    message: string;
    severity: AlertProps["severity"];
  }>({
    isOpen: false,
    message: "",
    severity: "success",
  });
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AircraftFilter>({});

  const createAircraftQuery = useCreateAircraft({
    onSuccess: () => {
      setOpen(false);
      setSnackbarState({
        ...snackbarState,
        message: "Created New Aircraft",
        isOpen: true,
      });
      queryClient.invalidateQueries({ queryKey: ["allAircrafts"] });
    },
  });

  const updateAircraftMutation = useUpdateAircraft({
    onSuccess: () => {
      setOpen(false);
      setSnackbarState({
        ...snackbarState,
        message: "Updated Aircraft",
        isOpen: true,
      });
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
    <>
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
        <Box mb={2} display="flex" flexDirection="row">
          <AircraftFilterPanel
            onChange={setFilters}
            searchQuery={searchQuery}
            updateSearchQuery={setSearchQuery}
          />
        </Box>
        <AircraftList searchQuery={searchQuery} filters={filters} />
      </Stack>
      <Snackbar
        open={snackbarState.isOpen}
        onClose={() => setSnackbarState({ ...snackbarState, isOpen: false })}
        autoHideDuration={4000}
      >
        <Alert
          onClose={() => setSnackbarState({ ...snackbarState, isOpen: false })}
          variant="filled"
          severity={snackbarState.severity}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}
