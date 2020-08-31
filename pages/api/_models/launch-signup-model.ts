import mongoose from 'mongoose';
import schemaOptions from './helpers/schema-options';
import { SchemaDefinition, MongoProps } from './helpers/types';

export type LaunchSignup = {
  email: string;
  hooperName: string;
};

// _id and __v are created by the database, and are transparent to the user.
export type LaunchSignupRequestedDoc = LaunchSignup & MongoProps;

export const LaunchSignupDefinition: SchemaDefinition<LaunchSignup> = {
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  hooperName: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
    },
  },
} as const;

const LaunchSignupSchema = new mongoose.Schema(LaunchSignupDefinition, schemaOptions);

export default (mongoose.models && mongoose.models.LaunchSignup) ||
  mongoose.model<LaunchSignup & mongoose.Document>('LaunchSignup', LaunchSignupSchema);
