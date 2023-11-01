import { globSync } from 'fast-glob';
import { addControllersToModule } from '../utils/nestmodule-helper';

export type AutoControllerOptions = {
  path: string[];
}

export function AutoController(options: AutoControllerOptions): ClassDecorator {
  return (target: Function) => {
    const controllers: any[] = []

    for (const path of options.path) {
      const filenames = globSync(path)
      for (const filename of filenames) {
        const Module = require(filename)
        const Classes = Object.values(Module)
        for (const Class of Classes) {
          if (typeof Class === 'function' && Reflect.getOwnMetadataKeys(Class).includes('__controller__')) {
            controllers.push(Class)
          }
        }
      }
    }

    addControllersToModule(target, controllers);
  };
}
