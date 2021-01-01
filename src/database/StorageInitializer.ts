import {MigrationManager} from './MigrationManager';
import {SchemaRegistrar} from './SchemaRegistrar';
export class StorageInitializer {
  public static async start(): Promise<void> {
    await MigrationManager.performMigration();
    const schemaRegistrar = new SchemaRegistrar();
    schemaRegistrar.initializeSchema();
    schemaRegistrar.establishAssociations();
  }
}
