import { DynamicModule, ForwardReference, Provider, Type } from "@nestjs/common";

export type ModuleClass<T = any> = { new(): T };

export function addProviderToModule<T>(module: ModuleClass<T> | Function, provider: Provider) {
  Reflect.defineMetadata("providers", [
    ...(Reflect.getMetadata("providers", module) || []),
    provider,
  ], module);
}

export function addProvidersToModule<T>(module: ModuleClass<T> | Function, providers: Array<Provider>) {
  Reflect.defineMetadata("providers", [
    ...(Reflect.getMetadata("providers", module) || []),
    ...providers,
  ], module);
}

export function addControllerToModule<T>(module: ModuleClass<T> | Function, controller: Type) {
  Reflect.defineMetadata("controllers", [
    ...(Reflect.getMetadata("controllers", module) || []),
    controller,
  ], module);
}

export function addControllersToModule<T>(module: ModuleClass<T> | Function, controllers: Array<Type>) {
  Reflect.defineMetadata("controllers", [
    ...(Reflect.getMetadata("controllers", module) || []),
    ...controllers,
  ], module);
}

export function addImportToModule<T>(module: ModuleClass<T> | Function, _import: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference) {
  Reflect.defineMetadata("imports", [
    ...(Reflect.getMetadata("imports", module) || []),
    _import,
  ], module);
}

export function addImportsToModule<T>(module: ModuleClass<T> | Function, _imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>) {
  Reflect.defineMetadata("imports", [
    ...(Reflect.getMetadata("imports", module) || []),
    ..._imports,
  ], module);
}

export function addExportToModule<T>(module: ModuleClass<T> | Function, _export: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference) {
  Reflect.defineMetadata("exports", [
    ...(Reflect.getMetadata("exports", module) || []),
    _export,
  ], module);
}

export function addExportsToModule<T>(module: ModuleClass<T> | Function, _exports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>) {
  Reflect.defineMetadata("exports", [
    ...(Reflect.getMetadata("exports", module) || []),
    ..._exports,
  ], module);
}