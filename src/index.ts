import {StorageInitializer} from './database/StorageInitializer';
import {ExpressServerInitializer} from './ExpressServerInitializer';
import {GraphqlServerInitializer} from './GraphqlServerInitializer';

async function run(): Promise<void> {
  try {
    await StorageInitializer.start();
    GraphqlServerInitializer.startGraphqlServer();
    ExpressServerInitializer.startExpressServer();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

run().then(() => console.log('Successfully started everything'));
