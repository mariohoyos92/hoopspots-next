import mongoose from 'mongoose';

export type Point = {
  type: 'Point';
  coordinates: [number, number];
};

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export default pointSchema;
