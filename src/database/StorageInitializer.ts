import {MigrationManager} from './MigrationManager';
import {SchemaRegistrar} from './SchemaRegistrar';

export class StorageInitializer {
  public static async start(): Promise<void> {
    try {
      await MigrationManager.performMigration();
      const schemaRegistrar = new SchemaRegistrar();
      schemaRegistrar.initializeSchema();
      schemaRegistrar.establishAssociations();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
