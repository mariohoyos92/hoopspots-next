import mongoose from 'mongoose';
import schemaOptions from './helpers/schema-options';
import { SchemaDefinition, MongoProps } from './helpers/types';
import pointSchema, { Point } from './point-schema';

export type Place = {
  slug: string;
  text: string;
  center: Point;
  mapboxId: string;
  mapboxPlaceName: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type PlaceRequestedDoc = Place & MongoProps;

const placeDefinition: SchemaDefinition<Place> = {
  slug: { type: String, required: true, index: true, unique: true, trim: true },
  text: { type: String, required: true, trim: true },
  center: { type: pointSchema, index: true },
  mapboxId: { type: String, required: true },
  mapboxPlaceName: { type: String, required: true },
} as const; // as const is important here for typescript to infer the required type correctly.

const PlaceSchema = new mongoose.Schema(placeDefinition, schemaOptions);

export default (mongoose.models && mongoose.models.Place) ||
  mongoose.model<Place & mongoose.Document>('Place', PlaceSchema);
