import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import type Yup from "yup";
import { loadPackage } from '@nestjs/common/utils/load-package.util';


export function YupValidatedParam<T extends any>(name: string, validationSchema: Yup.Schema<T>) {
  return createParamDecorator<T>(
    async (data, ctx: ExecutionContext) => {
      const Yup = loadPackage('yup', 'YupValidatedParam') as typeof import("yup");
      const request = ctx.switchToHttp().getRequest();
      const param = request.params[name];
      try {
        return await validationSchema.required().validate(param, { abortEarly: false });
      } catch (error) {
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
