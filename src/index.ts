import {StorageInitializer} from './database/StorageInitializer';
import {ExpressServerInitializer} from './ExpressServerInitializer';
import {GraphqlServerInitializer} from './GraphqlServerInitializer';
import logger from './utils/logger';
async function run(): Promise<void> {
    logger.info('Starting the server.');
    await StorageInitializer.start();
    ExpressServerInitializer.start(3000);
    GraphqlServerInitializer.startGraphqlServer();
}

run().then(() => logger.info('Successfully started server'));
