import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAircraft,
  deleteAircraft,
  fetchAircraftTypes,
  fetchAllAircrafts,
  fetchAircraftById,
  updateAircraft,
  type Aircraft,
} from "../api/aircrafts";

export const useFetchAircrafts = () =>
  useQuery({
    queryKey: ["allAircrafts"],
    queryFn: fetchAllAircrafts,
  });

export const useFetchAircraftById = (aircraftId: string) =>
  useQuery({
    queryKey: ["aircraftById", aircraftId],
    queryFn: () => fetchAircraftById(aircraftId),
    enabled: !!aircraftId,
  });

export const useCreateAircraft = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: createAircraft,

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useUpdateAircraft = (options: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (aircraft: Aircraft) => updateAircraft(aircraft),

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useAircraftTypes = () =>
  useQuery({
    queryKey: ["aircraftTypes"],
    queryFn: fetchAircraftTypes,
  });

export const useDeleteAircraft = (options: {
  onSuccess?: (deleteId: string) => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (aircraftId: string) => deleteAircraft(aircraftId),

    onSuccess: (_data, aircraftId) => {
      options?.onSuccess?.(aircraftId);
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
