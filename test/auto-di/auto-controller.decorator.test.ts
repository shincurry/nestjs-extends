import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication, Module } from '@nestjs/common';
import { AutoController } from '../../src';
import path from 'path';
import request from 'supertest';
import { AController } from './controllers/a.controller';
import { BController } from './controllers/b.controller';
import { AClass } from './classes/a-class';

@Controller('extra')
export class ExtraController {}

@AutoController({
  path: [
    path.join(__dirname, "./controllers/*.js"),
  ],
})
@AutoController({
  path: [
    path.join(__dirname, "./classes/*.js"),
  ],
})
@Module({
  controllers: [
    ExtraController,
  ]
})
class TestAutoControllerModule {}

@AutoController({
  path: [],
})
@Module({})
class EmptyTestAutoControllerModule {}

describe('AutoControllerModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TestAutoControllerModule,
        EmptyTestAutoControllerModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test controllers loaded.`, async () => {
    expect(app.get(AController)).toBeInstanceOf(AController)
    expect(app.get(BController)).toBeInstanceOf(BController)
    expect(() => { app.get(AClass) }).toThrowError()

    const responseA = await request(app.getHttpServer()).get('/a')
    expect(responseA.statusCode).toBe(200)
    expect(responseA.text).toBe('A: hello world')
    const responseB = await request(app.getHttpServer()).get('/b')
    expect(responseB.statusCode).toBe(200)
    expect(responseB.text).toBe('B: hello world')
  });
});