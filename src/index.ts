import {StorageInitializer} from "./database/StorageInitializer";
import {ServerInitializer} from "./ServerInitializer";

function run(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await StorageInitializer.start();
            ServerInitializer.start();

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

run().then(r => console.log("Successfully started everything"));
