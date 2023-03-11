import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication, Post } from '@nestjs/common';
import { YupValidatedBody } from '../../src/Yup';
import * as Yup from 'yup';
import request from 'supertest';

const TestBodyValidationSchema = Yup.object({
  text: Yup.string().required(),
  id: Yup.number().integer().required(),
  isDesktop: Yup.boolean().required(),
}).required()

@Controller('/')
export class TestController {
  @Post('/case-failed')
  async caseFailed(
    @YupValidatedBody(TestBodyValidationSchema) body: Yup.InferType<typeof TestBodyValidationSchema>,
  ) {
    return body
  }

  @Post('/case-success')
  async caseSuccess(
    @YupValidatedBody(TestBodyValidationSchema) body: Yup.InferType<typeof TestBodyValidationSchema>,
  ) {
    return body
  }
}

describe('YupValidatedBody', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test body failed.`, () => {
    const body = {
      id: 3.1415926,
      isDesktop: 'notboolean',
    }
    return request(app.getHttpServer())
      .post('/case-failed')
      .send(body)
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'text is a required field',
          'id must be an integer',
          'isDesktop must be a `boolean` type, but the final value was: `"notboolean"`.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test body success.`, () => {
    const body = {
      text: 'abc',
      id: 10,
      isDesktop: true,
    }
    return request(app.getHttpServer())
      .post('/case-success')
      .send(body)
      .expect(201)
      .expect(body)
  });
});