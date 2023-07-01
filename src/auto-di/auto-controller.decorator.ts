import { globSync } from 'fast-glob';
import { chain } from "lodash";
import { addControllersToModule } from '../utils/nestmodule-helper';

export type AutoControllerOptions = {
  path: string[];
}

export function AutoController(options: AutoControllerOptions): ClassDecorator {
  return (target: Function) => {
    const controllers: any[] = chain(options.path)
      .map((i) => globSync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__controller__'))
      .value();

    addControllersToModule(target, controllers);
  };
}
