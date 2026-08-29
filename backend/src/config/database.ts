import mongoose from 'mongoose';
import { env } from './index';
import logger from '../utils/logger';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB connected: ${env.MONGODB_URI}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
}
