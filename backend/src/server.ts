import app from './app';
import { env } from './config';
import { connectDB } from './config/database';
import { initializeFirebase } from './config/firebase';
import logger from './utils/logger';

async function main() {
  await connectDB();
  initializeFirebase();

  app.listen(env.PORT, () => {
    logger.info(`FaceID Hub backend running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

main().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
