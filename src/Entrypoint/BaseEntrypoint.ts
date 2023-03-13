import { BeforeApplicationShutdown, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

export abstract class BaseEntrypoint implements
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown {

  onModuleInit() {}
  onApplicationBootstrap() {}
  onModuleDestroy() {}
  beforeApplicationShutdown(signal?: string | undefined) {}
  onApplicationShutdown(signal?: string | undefined) {}

}
