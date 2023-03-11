import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AutoControllerModule } from '../../src';
import path from 'path';
import request from 'supertest';
import { AController } from './controllers/A.controller';
import { BController } from './controllers/B.controller';
import { AClass } from './classes/AClass';

describe('AutoControllerModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AutoControllerModule.forRoot({
          name: "TestControllers",
          path: [
            path.join(__dirname, "./controllers/*.js"),
          ],
        }),
        AutoControllerModule.forRoot({
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