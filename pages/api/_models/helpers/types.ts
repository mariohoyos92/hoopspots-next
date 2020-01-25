import mongoose from "mongoose";
import { ObjectID } from "mongodb";

export type IsRequired<T> = undefined extends T
  ? { required?: false }
  : { required: true };

// force some consistency between type definition and mongoose schema (so they stay in sync)
export type SchemaDefinition<T> = {
  [U in keyof T]-?: { type: unknown } & IsRequired<T[U]> &
    mongoose.SchemaTypeOpts<unknown>;
};

export type MongoProps = {
  _id: ObjectID;
  __v: number;
};
