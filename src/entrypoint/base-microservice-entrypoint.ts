import { INestMicroservice } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { addProviderToModule, ModuleClass } from "../utils/nestmodule-helper";
import { BaseEntrypoint } from "./base-entrypoint";
import { OnApplicationListened } from "./interface/on-application-listened.interface";

export abstract class BaseMicroserviceEntrypoint extends BaseEntrypoint implements OnApplicationListened {

  protected microservice!: INestMicroservice;

  onApplicationListened() {}

  static async bootstrap<T extends MicroserviceOptions>(module: ModuleClass, options?: NestApplicationContextOptions & T) {
    // 0. Dependency inject: entrypoint class
    addProviderToModule(module, this as any);

    // 1. Create nest application.
    const microservice = await NestFactory.createMicroservice<T>(module, options);
    microservice.enableShutdownHooks();
    const entrypoint = microservice.get(this);
    entrypoint.microservice = microservice;
    await entrypoint.onApplicationCreated();

    // 2. listen nest http server.
    await microservice.listen();
    await entrypoint.onApplicationListened();

    return microservice;
  }

}
