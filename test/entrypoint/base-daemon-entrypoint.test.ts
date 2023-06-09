import { describe, it } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { BaseDaemonEntrypoint } from '../../src';

@Module({})
class TestDaemonModule {}

@Injectable()
class TestDaemon extends BaseDaemonEntrypoint {

  async main() {

  }
}

describe('BaseDaemonEntrypoint', () => {
  it(`test run app based on BaseDaemonEntrypoint.`, async () => {
    const context = await TestDaemon.bootstrap(TestDaemonModule, { logger: false });
    await context.close();
  });
});