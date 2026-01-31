import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
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
    <Card sx={{ padding: 1, height: 250 }}>
      <CardHeader
        sx={{ pb: 0 }}
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
        subheader={
          <Typography sx={{ opacity: 0.8, fontSize: 14 }}>
            {aircraft.aircraftType}{" "}
            {aircraft.serialNumber ? `| ${aircraft.serialNumber}` : ""} |{" "}
            {aircraft.id}
          </Typography>
        }
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box display="flex" flexDirection="row">
          <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography>Seats:</Typography>
              <Typography>{aircraft.numberOfSeats}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Next Maintenance:</Typography>
              <Typography>
                {new Date(aircraft.nextMaintenanceDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Suited for Pets:</Typography>
              <Chip
                size="small"
                label={aircraft.isSuitedForPets ? "Yes" : "No"}
                color={aircraft.isSuitedForPets ? "success" : "default"}
                sx={{ color: "white", px: 2 }}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            flexGrow={1}
            gap={2}
          >
            <Typography component="span" sx={{ mr: 1 }}>
              Interior Condition:
            </Typography>
            <Box>
              <CircularProgressWithLabel
                enableTrackSlot
                color={aircraft.interiorCondition < 0.5 ? "error" : "success"}
                value={aircraft.interiorCondition * 100}
                label={aircraft.interiorCondition.toFixed(2)}
              />
            </Box>
          </Box>
        </Box>
        {aircraft.comments && (
          <Typography variant="caption" fontStyle={"italic"} fontSize={14}>
            {aircraft.comments}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
