import {StorageInitializer} from './database/StorageInitializer';
import {ServerInitializer} from './ServerInitializer';

async function run(): Promise<void> {
  try {
    await StorageInitializer.start();
    await ServerInitializer.start();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

run().then(() => console.log('Successfully started everything'));
