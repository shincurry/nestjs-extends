import { INestApplicationContext } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import { NestFactory } from "@nestjs/core";
import { addProviderToModule, ModuleClass } from "../Utils/NestModuleHelper";
import { BaseEntrypoint } from "./BaseEntrypoint";

export abstract class BaseScriptEntrypoint extends BaseEntrypoint {
  protected context!: INestApplicationContext;

  public abstract execute(): void;

  static async createApp(module: ModuleClass, options?: NestApplicationContextOptions) {
    // 0. Dependency inject: entrypoint class
    addProviderToModule(module, this as any);

    // 1. Create nest application.
    const context = await NestFactory.createApplicationContext(module, options);
    context.enableShutdownHooks();
    const entrypoint = context.get(this);
    entrypoint.context = context;

    // 2. run execute function.
    await entrypoint.execute();

    // 3. Close context.
    context.close();
  }

}
