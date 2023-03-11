import { DynamicModule, Logger, Module } from "@nestjs/common";
import glob from 'glob';
import { chain } from "lodash";

export interface AutoProviderModuleOptions {
  name?: string;
  global?: boolean;
  path: string[];
}

@Module({})
export class AutoProviderModule {

  static forRoot(data: AutoProviderModuleOptions): DynamicModule {
    const providers: any[] = chain(data.path)
      .map((i) => glob.sync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__injectable__'))
      .value();

    return {
      module: AutoProviderModule,
      global: data.global,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
