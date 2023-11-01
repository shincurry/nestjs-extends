import { globSync } from 'fast-glob';
import { addExportsToModule, addProvidersToModule } from '../utils/nestmodule-helper';

export type AutoProviderOptions = {
  path: string[];
  export?: boolean;
}

export function AutoProvider(options: AutoProviderOptions): ClassDecorator {
  return (target: Function) => {
    const providers: any[] = []

    for (const path of options.path) {
      const filenames = globSync(path)
      for (const filename of filenames) {
        const Module = require(filename)
        const Classes = Object.values(Module)
        for (const Class of Classes) {
          if (typeof Class === 'function' && Reflect.getOwnMetadataKeys(Class).includes('__injectable__')) {
            providers.push(Class)
          }
        }
      }
    }

    addProvidersToModule(target, providers);

    if (options.export) {
      addExportsToModule(target, providers);
    }
  };
}
