import {DatabaseClient} from './client';
import {Umzug, SequelizeStorage} from 'umzug';

const sequelize = DatabaseClient.defaultClient();
export const migrator = new Umzug({
  migrations: {glob: ['migrations/*.js', {cwd: __dirname}]},
  context: sequelize,
  storage: new SequelizeStorage({sequelize}),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
