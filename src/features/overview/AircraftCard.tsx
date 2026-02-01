import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import type { Aircraft } from "../../api/aircrafts";
import { Delete, Edit, Star } from "@mui/icons-material";
import { CircularProgressWithLabel } from "../../components/CircularProgressWithLabel";
import { useAircraftId } from "../../contexts/AircraftIdContext";
import { useDialogOpen } from "../../contexts/DialogContext";
import { useDeleteAircraft } from "../../hooks/aircrafts";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const AircraftCard = memo(
  ({
    aircraft,
    isFavorite,
    toggleFavorite,
  }: {
    aircraft: Aircraft;
    isFavorite: boolean;
    toggleFavorite: (id: string) => void;
  }) => {
    const queryClient = useQueryClient();
    const [, setAircraftId] = useAircraftId();
    const [, setOpen] = useDialogOpen();
    const [deleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLElement | null>(
      null,
    );
    const anchorOpen = Boolean(commentAnchorEl);

    const deleteMutation = useDeleteAircraft({
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Aircraft[]>(["allAircrafts"], (old) => {
          return old ? old.filter((a) => a.id !== deletedId) : old;
        });
      },
    });

    const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
      setCommentAnchorEl(event.currentTarget);
    };

    const handleAnchorClose = () => {
      setCommentAnchorEl(null);
    };

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
              onClick={() => toggleFavorite(aircraft.id)}
              key={0}
              aria-label="favorite"
            >
              {isFavorite ? <Star color="warning" /> : <Star />}
            </IconButton>,
            <IconButton
              onClick={handleEditClick}
              key={1}
              aria-label="edit aircraft"
            >
              <Edit />
            </IconButton>,
            <IconButton
              key={2}
              aria-label="more options"
              onClick={handleDelete}
            >
              <Delete color="error" />
            </IconButton>,
            <ConfirmDialog
              key={3}
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
            flexDirection: "column",
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
            <>
              <Typography
                variant="caption"
                fontStyle="italic"
                fontSize={14}
                sx={{
                  cursor: aircraft.comments.length > 100 ? "pointer" : "auto",
                }}
                onClick={(event) => handleAnchorClick(event)}
              >
                {aircraft.comments.slice(0, 100)}{" "}
                {aircraft.comments.length > 100 ? "..." : ""}
              </Typography>
              {aircraft.comments.length > 100 && (
                <>
                  <Popover
                    open={anchorOpen}
                    anchorEl={commentAnchorEl}
                    onClose={handleAnchorClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Typography sx={{ p: 2, maxWidth: 400 }}>
                      {aircraft.comments}
                    </Typography>
                  </Popover>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  },
);
