import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import type { Request } from "express";
import type Yup from "yup";
import { loadPackage } from '@nestjs/common/utils/load-package.util';


export function YupValidatedBody<T extends Yup.Maybe<Yup.AnyObject>>(validationSchema: Yup.ObjectSchema<T>) {
  return createParamDecorator<T>(
    async (data, ctx: ExecutionContext) => {
      const Yup = loadPackage('yup', 'YupValidatedBody') as typeof import("yup");
      const request = ctx.switchToHttp().getRequest<Request>();
      const body = request.body;
      try {
        return await validationSchema.validate(body, { abortEarly: false });
      } catch (error: any) {
        /* istanbul ignore else */
        if (error instanceof Yup.ValidationError) {
          throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.errors,
            error: "Bad Request: ValidationError"
          }, HttpStatus.BAD_REQUEST)
        } else {
          throw error
        }
      }
    },
  )();
}
