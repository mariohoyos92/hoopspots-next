import mongoose from 'mongoose';

// Create cached connection variable
let cachedDb = null;

export const connectToMongo = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_SERVER_CONNECTION || 'mongodb://127.0.0.1:27017/', {
      useNewUrlParser: true,
      dbName: process.env.MONGO_DB_NAME || 'hoopspots',
      reconnectTries: Number.MAX_VALUE,
      autoReconnect: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    mongoose.connection.on('error', err => {
      console.error(err);
    });
    mongoose.connection.on('connected', () => console.log('New database connection'));
    cachedDb = db;
    return db;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectToMongo;
