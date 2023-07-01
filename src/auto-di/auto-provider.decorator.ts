import { globSync } from 'fast-glob';
import { chain } from "lodash";
import { addExportsToModule, addProvidersToModule } from '../utils/nestmodule-helper';

export type AutoProviderOptions = {
  path: string[];
  export?: boolean;
}

export function AutoProvider(options: AutoProviderOptions): ClassDecorator {
  return (target: Function) => {
    const providers: any[] = chain(options.path)
      .map((i) => globSync(i))
      .flatten()
      .map((path) => require(path))
      .map((i: any): any[] => {
        return Object.values(i) as any[]
      })
      .flatten()
      .filter((i) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes('__injectable__'))
      .value();

    addProvidersToModule(target, providers);

    if (options.export) {
      addExportsToModule(target, providers);
    }
  };
}
