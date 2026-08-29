import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export function validate(
  schema: ZodSchema,
  property: 'body' | 'params' | 'query' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      const formattedErrors = result.error.format();
      const messages = Object.entries(formattedErrors)
        .filter(([key]) => key !== '_errors')
        .flatMap(([field, value]) => {
          const errors = (value as { _errors?: string[] })?._errors || [];
          return errors.map((e) => `${field}: ${e}`);
        });

      throw new AppError(
        400,
        messages.length > 0 ? messages.join('; ') : 'Validation failed',
        'VALIDATION_ERROR',
        formattedErrors
      );
    }
    req[property] = result.data;
    next();
  };
}
