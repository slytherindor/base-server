// import {Author} from "./models/Author";
// import {User} from "./models/User";
// import {Book} from "./models/Book";
import * as fs from "fs";
import * as Path from "path";
import {Model} from "sequelize";

export class SchemaRegistrar {
    models: string[];
    constructor() {
        this.models = [];
    }
    public initializeSchema() {
        // Author.initialize();
        // Book.initialize();
        // User.initialize();
        fs.readdirSync(`${__dirname}/models`).forEach((file, index) => {
            if (Path.extname(file) == ".js") {
                // console.log(file);
                this.models.push(file);
            }
        })

        this.models.forEach(function (model: string, index: number) {
            let mod = require(Path.join(`${__dirname}/models`, model));
            // console.log(mod);
            mod.default.initialize();
        })
    };

    public establishAssociations() {
        // Author.associate();
        // Book.associate();
        this.models.forEach(function (model: string, index: number) {
            let mod = require(Path.join(`${__dirname}/models`, model));
            // console.log(mod);
            if (mod.default.associate) {
                mod.default.associate();
            }
        })
    }


}
