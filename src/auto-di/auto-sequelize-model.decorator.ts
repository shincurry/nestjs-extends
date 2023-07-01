import { SequelizeModule } from "@nestjs/sequelize";
import { globSync } from 'fast-glob';
import { chain } from "lodash";
import { addExportToModule, addImportToModule } from "../utils/nestmodule-helper";

export type AutoSequelizeModelOptions = {
  connection?: string;
  path: string[];
  export?: boolean;
}

/**
 * https://github.com/sequelize/sequelize-typescript/blob/0e43d08677db3c9a94d11639315676c6b8d90388/src/model/shared/model-service.ts#L6
 */
const SEQUELIZE_MODEL_NAME_KEY = 'sequelize:modelName';

export function AutoSequelizeModel(options: AutoSequelizeModelOptions): ClassDecorator {
  return (target: Function) => {
    const name = options.connection;
    const models: any[] = chain(options.path)
      .map((i) => globSync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => Object.values(i) as any[])
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.hasMetadata(SEQUELIZE_MODEL_NAME_KEY, i.prototype))
      .value();

    const module = SequelizeModule.forFeature(models, name);

    addImportToModule(target, module);

    if (options.export) {
      addExportToModule(target, module.module);
    }
  };
}