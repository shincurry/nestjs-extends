import { DynamicModule, InjectionToken, Module } from "@nestjs/common";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import type { CacheModuleAsyncOptions, CacheModuleOptions } from "@nestjs/cache-manager";

export type NamedCacheModuleOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheModuleOptions<StoreConfig>
export type NamedCacheModuleAsyncOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheModuleAsyncOptions<StoreConfig>

@Module({})
export class NamedCacheModule {
  static register<StoreConfig extends Record<any, any> = Record<string, any>>(
    name: InjectionToken,
    options: NamedCacheModuleOptions<StoreConfig>,
  ): DynamicModule {
    const NestCacheManager = loadPackage(
      '@nestjs/cache-manager',
      'NestCacheManager',
      () => require('@nestjs/cache-manager'),
    );
    const module = NestCacheManager.CacheModule.register(options)
    const provider = {
      provide: name,
      useExisting: NestCacheManager.CACHE_MANAGER,
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
    const NestCacheManager = loadPackage(
      '@nestjs/cache-manager',
      'NestCacheManager',
      () => require('@nestjs/cache-manager'),
    );
    const module = NestCacheManager.CacheModule.registerAsync(options)
    const provider = {
      provide: name,
      useExisting: NestCacheManager.CACHE_MANAGER,
    }
    /* istanbul ignore next */
    module.providers = [...(module.providers ?? []), provider]
    /* istanbul ignore next */
    module.exports = [...(module.exports ?? []), provider]
    return module;
  }
}