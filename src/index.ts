import {StorageInitializer} from './database/StorageInitializer';
import {ExpressServerInitializer} from './ExpressServerInitializer';
import logger from './utils/logger';
require('./utils/secrets');
async function run(): Promise<void> {
  logger.info('Starting the server.');
  await StorageInitializer.start();
  ExpressServerInitializer.start(3000);
}

run().then(() => logger.info('Successfully started server'));
