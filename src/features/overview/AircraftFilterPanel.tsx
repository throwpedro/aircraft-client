import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

export type AircraftFilter = {
  minSeats?: number;
  maxSeats?: number;
  minInteriorCondition?: number;
  maxInteriorCondition?: number;
  suitedForPets?: boolean;
};

type AircraftFilterPanelProps = {
  onChange: (filters: AircraftFilter) => void;
  initialFilters?: AircraftFilter;
  searchQuery: string;
  updateSearchQuery: (value: React.SetStateAction<string>) => void;
};

const DEFAULT_FILTERS: AircraftFilter = {
  minSeats: undefined,
  maxSeats: undefined,
  minInteriorCondition: 0,
  maxInteriorCondition: 1,
  suitedForPets: undefined,
};

export const AircraftFilterPanel = ({
  onChange,
  searchQuery,
  updateSearchQuery,
}: AircraftFilterPanelProps) => {
  const [filters, setFilters] = useState<AircraftFilter>(DEFAULT_FILTERS);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  return (
    <Box display="flex" flexDirection="column" gap={2} width={500}>
      <Box display="flex" flexDirection="row" gap={2}>
        {/* Search query */}
        <TextField
          label="Search by tail number or aircraft type"
          placeholder="QA-TJ..."
          value={searchQuery}
          onChange={(e) => updateSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
        />
        {/* Interior condition */}
        <Box flexGrow={1}>
          <Typography variant="body2">Interior Condition</Typography>
          <Slider
            value={[
              filters.minInteriorCondition ?? 0,
              filters.maxInteriorCondition ?? 1,
            ]}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, newValue) =>
              setFilters((f) => ({
                ...f,
                minInteriorCondition: (newValue as number[])[0],
                maxInteriorCondition: (newValue as number[])[1],
              }))
            }
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        {/* Number of seats */}
        <TextField
          sx={{
            flexGrow: 1,
          }}
          label="Min seats"
          type="number"
          value={filters.minSeats ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              minSeats: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          size="small"
        />
        <TextField
          sx={{
            flexGrow: 1,
          }}
          label="Max seats"
          type="number"
          value={filters.maxSeats ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              maxSeats: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          size="small"
        />
      </Box>

      <Box display="flex" flexDirection="row" gap={2}>
        {/* Suited for pets */}
        <FormControl size="small" sx={{ flex: 1 }} fullWidth>
          <InputLabel>Suited for pets</InputLabel>
          <Select
            fullWidth
            value={
              filters.suitedForPets === undefined
                ? "any"
                : filters.suitedForPets
                  ? "yes"
                  : "no"
            }
            label="Suited for pets"
            onChange={(e) => {
              const value = e.target.value;
              setFilters((f) => ({
                ...f,
                suitedForPets:
                  value === "any" ? undefined : value === "yes" ? true : false,
              }));
            }}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        {/* Reset filters */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setFilters(DEFAULT_FILTERS);
            updateSearchQuery("");
          }}
        >
          Reset filters
        </Button>
      </Box>
    </Box>
  );
};
