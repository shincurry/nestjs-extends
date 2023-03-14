import { CacheModule, CacheModuleAsyncOptions, CacheModuleOptions, CACHE_MANAGER, DynamicModule, InjectionToken, Module } from "@nestjs/common";

export type NamedCacheModuleOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheModuleOptions<StoreConfig>
export type NamedCacheModuleAsyncOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheModuleAsyncOptions<StoreConfig>

@Module({})
export class NamedCacheModule {
  static register<StoreConfig extends Record<any, any> = Record<string, any>>(
    name: InjectionToken,
    options: NamedCacheModuleOptions<StoreConfig>,
  ): DynamicModule {
    const module = CacheModule.register(options)
    const provider = {
      provide: name,
      useExisting: CACHE_MANAGER,
    }
    /* istanbul ignore next */
    module.providers = [...(module.providers ?? []), provider]
    /* istanbul ignore next */
    module.exports = [...(module.exports ?? []), provider]
    return module;
  }

  static registerAsync<StoreConfig extends Record<any, any> = Record<string, any>>(
    name: InjectionToken,
    options: NamedCacheModuleAsyncOptions<StoreConfig>,
  ): DynamicModule {
    const module = CacheModule.registerAsync(options)
    const provider = {
      provide: name,
      useExisting: CACHE_MANAGER,
    }
    /* istanbul ignore next */
    module.providers = [...(module.providers ?? []), provider]
    /* istanbul ignore next */
    module.exports = [...(module.exports ?? []), provider]
    return module;
  }
}