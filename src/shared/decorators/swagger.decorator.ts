import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { APISuccessResponse } from '../dto/success-response.dto';
import { APIErrorResponse, APIValidationErrorResponse } from '../dto/error-response.dto';

export const SuccessApiResponse = <TModel extends Type<any>>(
  model: TModel,
  options: { isArray?: boolean; status?: number | HttpStatus } = {
    isArray: true,
    status: 200,
  },
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(APISuccessResponse) },
          {
            properties: options?.isArray
              ? {
                  payload: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                }
              : {
                  payload: {
                    allOf: [{ $ref: getSchemaPath(model) }],
                  },
                },
          },
        ],
      },
      status: options.status || 200,
    }),
  );
};

export const ErrorApiResponse = (
  options: { status?: number | HttpStatus } = {
    status: 400,
  },
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(APIErrorResponse) }],
      },
      status: options.status,
    }),
  );
};

export const ValidationErrorApiResponse = (
  options: { status?: number | HttpStatus } = {
    status: 422,
  },
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(APIValidationErrorResponse) }],
      },
      status: options.status,
    }),
  );
};
