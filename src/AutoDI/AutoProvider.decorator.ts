import glob from 'glob';
import { chain } from "lodash";

export type AutoProviderOptions = {
  name?: string;
  path: string[];
}

export function AutoProvider(options: AutoProviderOptions): ClassDecorator {
  return (target: Function) => {
    const providers: any[] = chain(options.path)
      .map((i) => glob.sync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__injectable__'))
      .value();

    Reflect.defineMetadata("providers", [
      ...(Reflect.getMetadata("providers", target) || []),
      ...providers,
    ], target);
  };
}
