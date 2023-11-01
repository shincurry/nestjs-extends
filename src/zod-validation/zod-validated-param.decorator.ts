import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { zodMessagesFromError } from "../utils/zod-error-messages";
import type { ZodTypeAny } from "zod";


export function ZodValidatedParam(name: string, validationSchema: ZodTypeAny) {
  return createParamDecorator(
    async (data, ctx: ExecutionContext) => {
      const Zod = loadPackage('zod', 'ZodValidatedParam') as typeof import("zod");
      const { ZodError } = Zod;
      const request = ctx.switchToHttp().getRequest();
      const param = request.params[name];
      try {
        return await validationSchema.parseAsync(param);
      } catch (error) {
        /* istanbul ignore else */
        if (error instanceof ZodError) {
          throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: zodMessagesFromError(error),
            error: "Bad Request: ValidationError"
          }, HttpStatus.BAD_REQUEST)
        } else {
          throw error
        }
      }
    },
  )();
}
