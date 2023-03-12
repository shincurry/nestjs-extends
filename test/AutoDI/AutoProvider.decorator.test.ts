import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication, Injectable, Logger, Module } from '@nestjs/common';
import { AutoProvider } from '../../src';
import path from 'path';
import { AClass } from './classes/AClass';
import { AService } from './services/A.service';
import { BService } from './services/B.service';

@Injectable()
export class ExtraService {
}

@AutoProvider({
  name: "TestService",
  path: [
    path.join(__dirname, "./services/*.js"),
  ],
})
@AutoProvider({
  name: "TestClasses",
  path: [
    path.join(__dirname, "./classes/*.js"),
  ],
})
@Module({
  providers: [
    ExtraService,
  ]
})
class TestAutoProviderModule {}

describe('AutoProviderModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TestAutoProviderModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();
  });

  it(`test providers loaded.`, async () => {
    expect(app.get(AService)).toBeInstanceOf(AService)
    expect(app.get(BService)).toBeInstanceOf(BService)
    expect(() => { app.get(AClass) }).toThrowError()

    expect(app.get(AService).hello()).toBe('A')
    expect(app.get(BService).hello()).toBe('B')
  });
});