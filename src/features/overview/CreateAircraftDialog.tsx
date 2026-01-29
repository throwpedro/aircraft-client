import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { AIRCRAFT_FORM_ID, AircraftForm } from "./AircraftForm";
import type { SubmitPayload } from "../../routes/overview";
import { useDialogOpen } from "../../contexts/DialogContext";
import { useAircraftId } from "../../contexts/AircraftIdContext";

export type CreateAircraftDialogProps = {
  handleClose: () => void;
  handleSubmit: (payload: SubmitPayload) => void;
  loading: boolean;
};

export const CreateAircraftDialog = ({
  handleClose,
  handleSubmit,
  loading,
}: CreateAircraftDialogProps) => {
  const [open] = useDialogOpen();
  const [aircraftId, setAircraftId] = useAircraftId();

  const handleCloseDialog = () => {
    setAircraftId(null);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography>Create Aircraft</Typography>
      </DialogTitle>
      <DialogContent>
        <AircraftForm onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Button onClick={handleCloseDialog} color="error">
          Cancel
        </Button>
        <Button
          loading={loading}
          type="submit"
          form={AIRCRAFT_FORM_ID}
          variant="contained"
        >
          {aircraftId ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
