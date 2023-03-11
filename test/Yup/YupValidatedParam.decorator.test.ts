import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { YupValidatedParam } from '../../src/Yup';
import * as Yup from 'yup';
import request from 'supertest';

@Controller('/')
export class TestController {
  @Get('/case-failed/:id')
  async caseFailed(
    @YupValidatedParam("id", Yup.number()) id: number,
  ) {
    return { id }
  }

  @Get('/case-success/:id')
  async caseSuccess(
    @YupValidatedParam("id", Yup.number()) id: number,
  ) {
    return { id }
  }
}

describe('YupValidatedParam', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test param failed.`, () => {
    return request(app.getHttpServer())
      .get('/case-failed/textid')
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'this must be a `number` type, but the final value was: `NaN` (cast from the value `"textid"`).'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test param success.`, () => {
    return request(app.getHttpServer())
      .get('/case-success/1')
      .expect(200)
      .expect({ id: 1 });
  });

});