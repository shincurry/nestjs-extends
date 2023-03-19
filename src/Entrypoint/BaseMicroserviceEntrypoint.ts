import { INestMicroservice } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import { MicroserviceOptions } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { addProviderToModule, ModuleClass } from "../Utils/NestModuleHelper";
import { BaseEntrypoint } from "./BaseEntrypoint";

export abstract class BaseMicroserviceEntrypoint extends BaseEntrypoint {

  protected microservice!: INestMicroservice;

  onApplicationListened(): void {}

  static async bootstrap<T extends MicroserviceOptions>(module: ModuleClass, options?: NestApplicationContextOptions & T) {
    // 0. Dependency inject: entrypoint class
    addProviderToModule(module, this as any);

    // 1. Create nest application.
    const microservice = await NestFactory.createMicroservice<T>(module, options);
    microservice.enableShutdownHooks();
    const entrypoint = microservice.get(this);
    entrypoint.microservice = microservice;

    // 2. listen nest http server.
    await microservice.listen();
    await entrypoint.onApplicationListened();

    return microservice;
  }

}
