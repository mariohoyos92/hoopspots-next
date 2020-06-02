import mongoose from 'mongoose';
import schemaOptions from './helpers/schema-options';
import { SchemaDefinition, MongoProps } from './helpers/types';
import { MapboxAddressFields, mapboxAddressFieldsDefinition } from './court-model';

export type UserFromAuth = {
  // this is the userId in auth0 side of things
  sub: string;
  email?: string;
  email_verified?: boolean;
  // this is a normalized name, sometimes it's weird because it'll be an email or twitter handle
  name: string;
  nickname?: string;
  picture: string;
};

export type User = {
  userId: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
  location?: MapboxAddressFields;
  twitterProfileUrl?: string;
  gamesPlayed?: number;
  phoneNumber?: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type UserRequestedDoc = User & MongoProps;

const userDefinition: SchemaDefinition<User> = {
  userId: { type: String, required: true, index: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  profilePhotoUrl: { type: String, required: true },
  location: { type: mapboxAddressFieldsDefinition },
  twitterProfileUrl: { type: String, trim: true },
  gamesPlayed: { type: Number, required: true, default: 0, min: 0 },
  phoneNumber: { type: String, trim: true },
} as const; // as const is important here for typescript to infer the required type correctly.

const UserSchema = new mongoose.Schema(userDefinition, schemaOptions);

export default (mongoose.models && mongoose.models.User) ||
  mongoose.model<User & mongoose.Document>('User', UserSchema);
