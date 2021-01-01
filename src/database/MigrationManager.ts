import logger from '../utils/logger';
import {migrator} from './migrator';
class MigrationManagerError extends Error {}
export class MigrationManager {
  public static performMigration(): Promise<void> {
    logger.info('MigrationManager: Starting database migration.');
    return new Promise((resolve, reject) => {
      migrator
        .up()
        .then(() => {
          logger.info('MigrationManager: Database migration was successful.');
          resolve();
        })
        .catch(err => {
          // reject(new MigrationManagerError('Database migration failed.'));
          logger.error('MigrationManager: Database migration failed.');
          reject(err);
        });
    });
  }
}
