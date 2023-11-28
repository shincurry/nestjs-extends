import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { zodMessagesFromError } from "../utils/zod-error-messages";
import type { ZodTypeAny } from "zod";


export function ZodValidatedQueries(validationSchema: ZodTypeAny) {
  return createParamDecorator(
    async (data, ctx: ExecutionContext) => {
      const Zod = loadPackage('zod', 'ZodValidatedQueries') as typeof import("zod");
      const { ZodError } = Zod;
      const request = ctx.switchToHttp().getRequest();
      const queries = request.query;
      try {
        return await validationSchema.parseAsync(queries);
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
