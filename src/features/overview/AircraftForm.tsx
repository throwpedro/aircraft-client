import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Slider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { IsoDateString } from "../../api/aircrafts";
import { useAircraftTypes, useFetchAircraftById } from "../../hooks/aircrafts";
import type { SubmitPayload } from "../../routes/overview";
import { useAircraftId } from "../../contexts/AircraftIdContext";
import { useEffect } from "react";

export const AIRCRAFT_FORM_ID = "aircraft-form";

type AircraftFormValues = {
  aircraftType: string;
  tailNumber: string;
  comments?: string;
  isSuitedForPets: boolean;
  nextMaintenanceDate: Dayjs | null;
  serialNumber?: string;
  numberOfSeats: number;
  interiorCondition: number;
};

export function AircraftForm({
  onSubmit,
}: {
  onSubmit: (payload: SubmitPayload) => void;
}) {
  const [aircraftId] = useAircraftId();
  const { data: aircraftData } = useFetchAircraftById(aircraftId || "");
  const { control, handleSubmit, reset } = useForm<AircraftFormValues>({
    defaultValues: {
      aircraftType: aircraftData?.aircraftType || "",
      tailNumber: aircraftData?.tailNumber || "",
      comments: aircraftData?.comments || "",
      isSuitedForPets: aircraftData?.isSuitedForPets || false,
      nextMaintenanceDate: aircraftData?.nextMaintenanceDate
        ? dayjs(aircraftData.nextMaintenanceDate)
        : null,
      serialNumber: "",
      numberOfSeats: 4,
      interiorCondition: 0.8,
    },
  });

  useEffect(() => {
    if (!aircraftData) return;

    reset({
      aircraftType: aircraftData.aircraftType ?? "",
      tailNumber: aircraftData.tailNumber ?? "",
      comments: aircraftData.comments ?? "",
      isSuitedForPets: aircraftData.isSuitedForPets ?? false,
      nextMaintenanceDate: aircraftData.nextMaintenanceDate
        ? dayjs(aircraftData.nextMaintenanceDate)
        : null,
      serialNumber: aircraftData.serialNumber ?? "",
      numberOfSeats: aircraftData.numberOfSeats ?? 4,
      interiorCondition: aircraftData.interiorCondition ?? 0.8,
    });
  }, [aircraftData, reset]);

  const { data: aircraftTypes } = useAircraftTypes();

  const submit = (data: AircraftFormValues) => {
    const submitPayload: SubmitPayload = aircraftId
      ? {
          mode: "update",
          aircraft: {
            ...data,
            id: aircraftId,
            nextMaintenanceDate:
              data.nextMaintenanceDate?.toISOString() as IsoDateString,
          },
        }
      : {
          mode: "create",
          aircraft: {
            ...data,
            nextMaintenanceDate:
              data.nextMaintenanceDate?.toISOString() as IsoDateString,
          },
        };
    onSubmit(submitPayload);
  };

  if (!aircraftData && !!aircraftId) {
    return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form id={AIRCRAFT_FORM_ID} onSubmit={handleSubmit(submit)}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Aircraft type */}
          <Controller
            name="aircraftType"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel id="aircraft-type-label">Aircraft type</InputLabel>

                <Select
                  {...field}
                  labelId="aircraft-type-label"
                  label="Aircraft type"
                >
                  {aircraftTypes?.map((type) => (
                    <MenuItem key={type.name} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Tail number */}
          <Controller
            name="tailNumber"
            control={control}
            rules={{ required: "Tail number is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Tail number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          {/* Seats */}
          <Controller
            name="numberOfSeats"
            control={control}
            rules={{ min: 1, required: "Number of seats is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Number of seats"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          {/* Maintenance date */}
          <Controller
            name="nextMaintenanceDate"
            control={control}
            rules={{ required: "Maintenance date is required" }}
            render={({ field, fieldState }) => (
              <DatePicker
                label="Next maintenance date"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />

          {/* Interior condition */}
          <Controller
            name="interiorCondition"
            control={control}
            render={({ field }) => (
              <>
                <Typography>
                  Interior condition: {(field.value * 100).toFixed(0)}%
                </Typography>
                <Slider
                  {...field}
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                />
              </>
            )}
          />

          {/* Pets */}
          <Controller
            name="isSuitedForPets"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Suited for pets"
              />
            )}
          />

          {/* Serial number */}
          <Controller
            name="serialNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Serial number" fullWidth />
            )}
          />

          {/* Comments */}
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Comments"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
