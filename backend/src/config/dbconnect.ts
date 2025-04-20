import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

let cachedConnection: typeof mongoose | null = null;

export const dbConnect = async (): Promise<typeof mongoose | void> => {
  if (cachedConnection) {
    console.log('Using existing database connection');
    return cachedConnection;
  }

  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('MongoDB connection URL not found in environment variables');
    throw new Error('Database configuration error');
  }

  try {
    const connection = await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
    
    cachedConnection = connection;

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); 
    }
    throw err; 
  }
};

export const checkDbConnection = (): boolean => {
  return mongoose.connection.readyState === 1;
};
