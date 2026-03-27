import {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
} from "@/firebase/firestore";

export interface Station {
  id: string;
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
  country: string;
}

export const getAllStations = () => getCollection("stations") as Promise<Station[]>;

export const addStation = (data: Omit<Station, "id">) =>
  addDocument("stations", data as Record<string, unknown>);

export const updateStation = (id: string, data: Partial<Station>) =>
  updateDocument("stations", id, data as Record<string, unknown>);

export const deleteStation = (id: string) => deleteDocument("stations", id);
