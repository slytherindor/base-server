import {StorageInitializer} from './database/StorageInitializer';
import {GraphqlServerInitializer} from './GraphqlServerInitializer';
import {ExpressServerInitializer} from "./ExpressServerInitializer";

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
