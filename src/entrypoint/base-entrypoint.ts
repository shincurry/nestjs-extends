import { BeforeApplicationShutdown, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { OnApplicationCreated } from "./interface/on-application-created.interface";

export abstract class BaseEntrypoint implements
  OnApplicationCreated,
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
  OnApplicationShutdown {

  onApplicationCreated() {}
  onApplicationBootstrap() {}
  beforeApplicationShutdown(signal?: string | undefined) {}
  onApplicationShutdown(signal?: string | undefined) {}

}
