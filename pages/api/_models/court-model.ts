import mongoose from 'mongoose';
import schemaOptions from './helpers/schema-options';
import { SchemaDefinition, MongoProps } from './helpers/types';
import pointSchema, { Point } from './point-schema';

export type MapboxAddressFields = {
  id: string;
  center: Point;
  text: string;
  placeName: string;
};

export type Court = {
  courtName: string;
  description: string;
  geoLocationData: MapboxAddressFields;
  createdBy: string;
  indoorOutdoor: ['indoor', 'outdoor', 'both_or_multiple'];
  publicPrivate: ['public', 'private'];
  slug: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type CourtRequestedDoc = Court & MongoProps;

export const mapboxAddressFieldsDefinition: SchemaDefinition<MapboxAddressFields> = {
  id: { type: String, required: true },
  center: { type: pointSchema, required: true, index: '2dsphere' },
  text: { type: String, required: true },
  placeName: { type: String, required: true },
} as const;

const courtDefinition: SchemaDefinition<Court> = {
  // will refer to userId
  createdBy: { type: String, required: true },
  geoLocationData: { type: mapboxAddressFieldsDefinition, required: true },
  courtName: { type: String, required: true },
  description: { type: String, required: true },
  indoorOutdoor: { type: String, required: true },
  publicPrivate: { type: String, required: true },
  slug: { type: String, require: true, index: true, unique: true },
} as const; // as const is important here for typescript to infer the required type correctly.

const CourtSchema = new mongoose.Schema(courtDefinition, schemaOptions);

export default (mongoose.models && mongoose.models.Court) ||
  mongoose.model<Court & mongoose.Document>('Court', CourtSchema);
