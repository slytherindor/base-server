import * as fs from 'fs';
import * as Path from 'path';

export class SchemaRegistrar {
  models: string[];
  constructor() {
    this.models = [];
  }
  public initializeSchema() {
    fs.readdirSync(`${__dirname}/models`).forEach((file: string) => {
      if (Path.extname(file) === '.js') {
        this.models.push(file);
      }
    });

    this.models.forEach((model: string) => {
      const mod = require(Path.join(`${__dirname}/models`, model));
      mod.default.initialize();
    });
  }

  public establishAssociations() {
    this.models.forEach((model: string) => {
      const mod = require(Path.join(`${__dirname}/models`, model));
      if (mod.default.associate) {
        mod.default.associate();
      }
    });
  }
}
