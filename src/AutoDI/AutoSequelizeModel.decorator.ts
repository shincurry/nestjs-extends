import { SequelizeModule } from "@nestjs/sequelize";
import { DEFAULT_CONNECTION_NAME } from "@nestjs/sequelize/dist/sequelize.constants";
import { globSync } from 'glob';
import { chain } from "lodash";
import { Model } from "sequelize-typescript";

export type AutoSequelizeModelOptions = {
  connection?: string;
  path: string[];
}

export function AutoSequelizeModel(options: AutoSequelizeModelOptions): ClassDecorator {
  return (target: Function) => {
    const name = options.connection || DEFAULT_CONNECTION_NAME;

    const models: any[] = chain(options.path)
      .map((i) => globSync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Model.isPrototypeOf(i))
      .value();

    SequelizeModule.forFeature(models, name);
  };
}