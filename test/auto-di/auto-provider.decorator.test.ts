import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication, Injectable, Logger, Module } from '@nestjs/common';
import { AutoProvider } from '../../src';
import path from 'path';
import { AClass } from './classes/a-class';
import { AService } from './services/A.service';
import { BService } from './services/B.service';

@Injectable()
export class ExtraService {
}

@Injectable()
export class Extra2Service {
}

@AutoProvider({
  path: [
    path.join(__dirname, "./services/*.js"),
  ],
})
@AutoProvider({
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

@AutoProvider({
  path: [
    path.join(__dirname, "./services/*.js"),
  ],
  export: true,
})
@Module({
  providers: [
    Extra2Service,
  ]
})
class TestExportAutoProviderModule {}

@AutoProvider({
  path: [],
})
@Module({})
class TestEmptyAutoProviderModule {}

describe('AutoProviderModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TestAutoProviderModule,
        TestExportAutoProviderModule,
        TestEmptyAutoProviderModule,
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