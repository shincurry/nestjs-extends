import glob from 'glob';
import { chain } from "lodash";

export type AutoControllerOptions = {
  path: string[];
}

export function AutoController(options: AutoControllerOptions): ClassDecorator {
  return (target: Function) => {
    const controllers: any[] = chain(options.path)
      .map((i) => glob.sync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__controller__'))
      .value();

    Reflect.defineMetadata("controllers", [
      ...(Reflect.getMetadata("controllers", target) || []),
      ...controllers,
    ], target);
  };
}
