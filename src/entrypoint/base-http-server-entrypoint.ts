import { INestApplication } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import { NestFactory } from "@nestjs/core";
import { addProviderToModule, ModuleClass } from "../utils/nestmodule-helper";
import { BaseEntrypoint } from "./base-entrypoint";

export abstract class BaseHttpServerEntrypoint extends BaseEntrypoint {

  protected host: string = "127.0.0.1";
  protected port: number = 9000;

  protected app!: INestApplication;

  onApplicationListened(): void {}

  static async bootstrap(module: ModuleClass, options?: NestApplicationContextOptions) {
    // 0. Dependency inject: entrypoint class
    addProviderToModule(module, this as any);

    // 1. Create nest application.
    const app = await NestFactory.create(module, options);
    app.enableShutdownHooks();
    const entrypoint = app.get(this);
    entrypoint.app = app;

    // 2. listen nest http server.
    const host = entrypoint.host;
    const port = entrypoint.port;
    await app.listen(port, host);
    await entrypoint.onApplicationListened();

    return app;
  }

}
