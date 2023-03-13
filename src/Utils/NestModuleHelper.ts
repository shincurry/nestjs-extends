import { DynamicModule, ForwardReference, Provider, Type } from "@nestjs/common";

export type ModuleClass<T = any> = { new(): T };

export function addProviderToModule<T>(module: ModuleClass<T>, provider: Provider) {
  Reflect.defineMetadata("providers", [
    ...(Reflect.getMetadata("providers", module) || []),
    provider,
  ], module);
}

export function addProvidersToModule<T>(module: ModuleClass<T>, providers: Array<Provider>) {
  Reflect.defineMetadata("providers", [
    ...(Reflect.getMetadata("providers", module) || []),
    ...providers,
  ], module);
}

export function addControllerToModule<T>(module: ModuleClass<T>, controller: Type) {
  Reflect.defineMetadata("controllers", [
    ...(Reflect.getMetadata("controllers", module) || []),
    controller,
  ], module);
}

export function addControllersToModule<T>(module: ModuleClass<T>, controllers: Array<Type>) {
  Reflect.defineMetadata("controllers", [
    ...(Reflect.getMetadata("controllers", module) || []),
    ...controllers,
  ], module);
}

export function addImportToModule<T>(module: ModuleClass<T>, _import: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference) {
  Reflect.defineMetadata("imports", [
    ...(Reflect.getMetadata("imports", module) || []),
    _import,
  ], module);
}

export function addImportsToModule<T>(module: ModuleClass<T>, _imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>) {
  Reflect.defineMetadata("imports", [
    ...(Reflect.getMetadata("imports", module) || []),
    ..._imports,
  ], module);
}