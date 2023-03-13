import { describe, it } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { BaseScriptEntrypoint } from '../../src';

@Module({})
class TestScriptModule {}

@Injectable()
class TestEntrypoint extends BaseScriptEntrypoint {

  async execute() {

  }
}

describe('BaseScriptEntrypoint', () => {
  it(`test run app based on BaseScriptEntrypoint.`, async () => {
    await TestEntrypoint.createApp(TestScriptModule, { logger: false });
  });
});