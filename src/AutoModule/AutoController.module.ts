import { DynamicModule, Module } from "@nestjs/common";
import glob from 'glob';
import { chain } from "lodash";

export interface AutoControllerModuleOptions {
  name: string;
  global?: boolean;
  path: string[];
}

@Module({})
export class AutoControllerModule {

  static forRoot(data: AutoControllerModuleOptions): DynamicModule {
    const controllers: any[] = chain(data.path)
      .map((i) => glob.sync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__controller__'))
      .value();

    return {
      module: AutoControllerModule,
      global: data.global,
      controllers: [...controllers],
    };
  }
}
