import { describe, it } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { BaseDaemonEntrypoint, BaseScriptEntrypoint } from '../../src';

@Module({})
class TestDaemonModule {}

@Injectable()
class TestDaemon extends BaseDaemonEntrypoint {

  async main() {

  }
}

describe('BaseDaemonEntrypoint', () => {
  it(`test run app based on BaseDaemonEntrypoint.`, async () => {
    const context = await TestDaemon.createApp(TestDaemonModule, { logger: false });
    await context.close();
  });
});