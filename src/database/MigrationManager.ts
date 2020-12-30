import {migrator} from './migrator';

export class MigrationManager {
  public static performMigration(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      migrator
        .up()
        .then(() => {
          console.log('Migration Successful');
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }
}
