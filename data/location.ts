import { Location } from "@/types";

import locationsJson from "./locations.json";

export const LocationData: Location[] = locationsJson as Location[];
export const LocationDataById = Object.fromEntries(LocationData.map((h) => [h.id, h]));
export const LocationDataByName = Object.fromEntries(LocationData.map((h) => [h.name, h]));
