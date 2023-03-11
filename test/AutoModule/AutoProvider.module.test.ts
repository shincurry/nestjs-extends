import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { AutoProviderModule } from '../../src';
import path from 'path';
import { AClass } from './classes/AClass';
import { AService } from './services/A.service';
import { BService } from './services/B.service';

describe('AutoProviderModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AutoProviderModule.forRoot({
          name: "TestService",
          path: [
            path.join(__dirname, "./services/*.js"),
          ],
        }),
        AutoProviderModule.forRoot({
          name: "TestClasses",
          path: [
            path.join(__dirname, "./classes/*.js"),
          ],
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
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