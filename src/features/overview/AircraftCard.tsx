import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import type { Aircraft } from "../../api/aircrafts";
import { Delete, Edit } from "@mui/icons-material";
import { CircularProgressWithLabel } from "../../components/CircularProgressWithLabel";
import { useAircraftId } from "../../contexts/AircraftIdContext";
import { useDialogOpen } from "../../contexts/DialogContext";
import { useDeleteAircraft } from "../../hooks/aircrafts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const AircraftCard = ({ aircraft }: { aircraft: Aircraft }) => {
  const queryClient = useQueryClient();
  const [, setAircraftId] = useAircraftId();
  const [, setOpen] = useDialogOpen();
  const [deleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const deleteMutation = useDeleteAircraft({
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Aircraft[]>(["allAircrafts"], (old) => {
        return old ? old.filter((a) => a.id !== deletedId) : old;
      });
    },
  });

  const handleEditClick = () => {
    setAircraftId(aircraft.id);
    setOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleOnDeleteConfirmed = () => {
    deleteMutation.mutate(aircraft.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <Card sx={{ padding: 2, height: 350 }}>
      <CardHeader
        action={[
          <IconButton
            onClick={handleEditClick}
            key={0}
            aria-label="edit aircraft"
          >
            <Edit />
          </IconButton>,
          <IconButton key={1} aria-label="more options" onClick={handleDelete}>
            <Delete color="error" />
          </IconButton>,
          <ConfirmDialog
            key={2}
            open={deleteConfirmOpen}
            title="Delete Aircraft"
            description="This action cannot be undone."
            onConfirm={handleOnDeleteConfirmed}
            onCancel={() => setIsDeleteConfirmOpen(false)}
          />,
        ]}
        title={aircraft.tailNumber}
        subheader={aircraft.aircraftType}
      />
      <CardContent>
        <Typography>Seats: {aircraft.numberOfSeats}</Typography>
        <Typography>
          Next Maintenance:{" "}
          {new Date(aircraft.nextMaintenanceDate).toLocaleTimeString()}
        </Typography>
        <Typography>
          Suited for Pets:{" "}
          <Box
            component="span"
            color={aircraft.isSuitedForPets ? "success.main" : "error.main"}
          >
            {aircraft.isSuitedForPets ? "Yes" : "No"}
          </Box>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component="span" sx={{ mr: 1 }}>
            Interior Condition:
          </Typography>
          <CircularProgressWithLabel
            enableTrackSlot
            color={aircraft.interiorCondition < 0.5 ? "error" : "success"}
            value={aircraft.interiorCondition * 100}
            label={aircraft.interiorCondition.toString()}
          />
        </Box>
        {aircraft.comments && (
          <Typography>Comments: {aircraft.comments}</Typography>
        )}
        {aircraft.serialNumber && (
          <Typography>Serial Number: {aircraft.serialNumber}</Typography>
        )}
        <Typography>Aircraft ID: {aircraft.id}</Typography>
      </CardContent>
    </Card>
  );
};
