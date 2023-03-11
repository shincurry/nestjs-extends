import { DynamicModule, Global, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DEFAULT_CONNECTION_NAME } from "@nestjs/sequelize/dist/sequelize.constants";
import { EntitiesMetadataStorage } from "@nestjs/sequelize/dist/entities-metadata.storage";
import glob from 'glob';
import { chain } from "lodash";
import { Model } from "sequelize-typescript";

export interface AutoSequelizeModelModuleOptions {
  global?: boolean;
  name?: string;
  path: string[];
}

@Global()
@Module({})
export class AutoSequelizeModelModule {

  static models(connection: string = DEFAULT_CONNECTION_NAME): Function[] {
    return EntitiesMetadataStorage.getEntitiesByConnection(connection)
  }

  static forRoot(data: AutoSequelizeModelModuleOptions): DynamicModule {
    const name = data.name || DEFAULT_CONNECTION_NAME;

    const models: any[] = chain(data.path)
      .map((i) => glob.sync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Model.isPrototypeOf(i))
      .value();

    const feature = SequelizeModule.forFeature(models, name)

    return {
      module: AutoSequelizeModelModule,
      global: data.global,
      imports: [feature],
    };
  }
}
