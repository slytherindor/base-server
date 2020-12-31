import {SequelizeStorage, Umzug} from 'umzug';
import {DatabaseClient} from './client';

const sequelize = DatabaseClient.defaultClient();
export const migrator = new Umzug({
  migrations: {glob: ['migrations/*.js', {cwd: __dirname}]},
  context: sequelize,
  storage: new SequelizeStorage({sequelize}),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
