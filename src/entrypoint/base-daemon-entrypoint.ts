import { INestApplicationContext } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import { NestFactory } from "@nestjs/core";
import { addProviderToModule, ModuleClass } from "../utils/nestmodule-helper";
import { BaseEntrypoint } from "./base-entrypoint";

export abstract class BaseDaemonEntrypoint extends BaseEntrypoint {
  protected context!: INestApplicationContext;

  public abstract main(): void;

  static async bootstrap(module: ModuleClass, options?: NestApplicationContextOptions) {
    // 0. Dependency inject: entrypoint class
    addProviderToModule(module, this as any);

    // 1. Create nest application.
    const context = await NestFactory.createApplicationContext(module, options);
    context.enableShutdownHooks();
    const entrypoint = context.get(this);
    entrypoint.context = context;
    await entrypoint.onApplicationCreated();

    // 2. run main function.
    await entrypoint.main();

    return context;
  }
}
