import mongoose from "mongoose";
import schemaOptions from "./helpers/schema-options";
import { SchemaDefinition, MongoProps } from "./helpers/types";

export type MapboxAddressFields = {
  id: string;
  center: number[];
  text: string;
  placeName: string;
};

export type Court = {
  // courtId will be the addressId returned from MapBox so that we will never have duplicate courts and we know it's a physical address we can drive to
  courtId: string;
  geoLocationData: MapboxAddressFields;
  courtName: string;
  createdBy: string;
  description: string;
  // the name of the "place" that the address is in, which would be a city, like "Las Vegas"
  mapboxPlace: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type CourtRequestedDoc = Court & MongoProps;

export const mapboxAddressFieldsDefinition: SchemaDefinition<MapboxAddressFields> = {
  id: { type: String, required: true },
  center: { type: [Number], required: true },
  text: { type: String, required: true },
  placeName: { type: String, required: true }
} as const;

const courtDefinition: SchemaDefinition<Court> = {
  // will refer to userId
  createdBy: { type: String, required: true },
  // will refer to the address id in mapbox
  courtId: { type: String, required: true, unique: true, index: true },
  geoLocationData: { type: mapboxAddressFieldsDefinition, required: true },
  courtName: { type: String, required: true },
  description: { type: String, required: true },
  mapboxPlace: { type: String, required: true }
} as const; // as const is important here for typescript to infer the required type correctly.

const CourtSchema = new mongoose.Schema(courtDefinition, schemaOptions);

export default mongoose.models.Court ||
  mongoose.model<Court & mongoose.Document>("Court", CourtSchema);
