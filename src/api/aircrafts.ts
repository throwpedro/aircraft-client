import { apiFetch } from "./api";

/**
 * ISO 8601 date string
 *
 * Example: 2026-12-14T16:33:54.730Z
 */
export type IsoDateString = string;

export type Aircraft = {
  id: string; // UUID
  aircraftType: string;
  tailNumber: string;
  comments?: string;
  isSuitedForPets: boolean;
  nextMaintenanceDate: IsoDateString;
  serialNumber?: string;
  numberOfSeats: number;
  interiorCondition: number; // 0.0 - 1.0
};

export type aircraftType = {
  name: string;
};

export const fetchAllAircrafts = async () => {
  const repsonse = await apiFetch<Aircraft[]>("/aircraft");
  return repsonse;
};

export const fetchAircraftById = async (id: string) => {
  const response = await apiFetch<Aircraft>(`/aircraft/${id}`);
  return response;
};

export const createAircraft = async (aircraft: Omit<Aircraft, "id">) => {
  const response = await apiFetch<Aircraft>("/aircraft", {
    method: "POST",
    body: JSON.stringify(aircraft),
  });
  return response;
};

export const deleteAircraft = async (id: string) => {
  await apiFetch<void>(`/aircraft/${id}`, {
    method: "DELETE",
  });
};

export const updateAircraft = async (aircraft: Aircraft) => {
  const response = await apiFetch<Aircraft>(`/aircraft/${aircraft.id}`, {
    method: "PUT",
    body: JSON.stringify(aircraft),
  });
  return response;
};

export const fetchAircraftTypes = async () => {
  const response = await apiFetch<aircraftType[]>("/aircrafttypes");
  return response;
};
