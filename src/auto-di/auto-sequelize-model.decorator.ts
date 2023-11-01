import { globSync } from 'fast-glob';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
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
    const NestSequelize = loadPackage('@nestjs/sequelize', 'AutoSequelizeModel');

    const name = options.connection;
    const models: any[] = []

    for (const path of options.path) {
      const filenames = globSync(path)
      for (const filename of filenames) {
        const Module = require(filename)
        const Classes = Object.values(Module)
        for (const Class of Classes) {
          if (typeof Class === 'function' && Reflect.hasMetadata(SEQUELIZE_MODEL_NAME_KEY, Class.prototype)) {
            models.push(Class)
          }
        }
      }
    }

    const module = NestSequelize.SequelizeModule.forFeature(models, name);

    addImportToModule(target, module);

    if (options.export) {
      addExportToModule(target, module.module);
    }
  };
}