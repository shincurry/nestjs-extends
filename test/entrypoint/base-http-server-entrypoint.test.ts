import { describe, it } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { BaseHttpServerEntrypoint } from '../../src';

@Module({})
class TestHttpServerModule {}

@Injectable()
class TestHttpServer extends BaseHttpServerEntrypoint {
  host = "127.0.0.1";
  port = 19485;
  constructor() {
    super()
    this.host = "127.0.0.1";
    this.port = 19485;
  }
}

describe('BaseHttpServerEntrypoint', () => {
  it(`test run app based on BaseEntrypoint.`, async () => {
    const app = await TestHttpServer.bootstrap(TestHttpServerModule, { logger: false });
    await app.close();
  });
});