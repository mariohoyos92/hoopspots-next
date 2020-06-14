import mongoose from 'mongoose';
import schemaOptions from './helpers/schema-options';
import { SchemaDefinition, MongoProps } from './helpers/types';

export type RSVP = {
  userId: string;
  profilePhotoUrl: string;
  name: string;
};

export type Game = {
  courtId: string;
  gameName: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  rsvps: [RSVP?];
  slug: string;
  createdBy: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type GameRequestedDoc = Game & MongoProps;

export const rsvpFieldsDefinition: SchemaDefinition<RSVP> = {
  userId: { type: String, required: true },
  profilePhotoUrl: { type: String },
  name: { type: String, required: true },
};

const GameDefinition: SchemaDefinition<Game> = {
  courtId: { type: String, required: true, index: true },
  gameName: { type: String, required: true },
  startTime: { type: Date, required: true, min: new Date() },
  endTime: { type: Date, required: true },
  description: { type: String },
  rsvps: { type: [rsvpFieldsDefinition], required: true, default: [] },
  slug: { type: String, required: true, index: true, unique: true, sparse: true },
  createdBy: { type: String, required: true },
} as const; // as const is important here for typescript to infer the required type correctly.

export const GameSchema = new mongoose.Schema(GameDefinition, schemaOptions);

export default (mongoose.models && mongoose.models.Game) ||
  mongoose.model<Game & mongoose.Document>('Game', GameSchema);
