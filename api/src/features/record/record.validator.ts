import { z } from 'zod';

import { stringNonEmptySchema, bigintStringSchema, booleanStringSchema } from '../../utils/schemas';

const getRequestObject = {
  params: z.object({
    recordId: bigintStringSchema,
  }),
};
const getRequestSchema = z.object(getRequestObject);

const getAllRequestObject = {
  query: z
    .object({
      active: booleanStringSchema,
      comment: stringNonEmptySchema,
      activityId: bigintStringSchema.or(z.array(bigintStringSchema)).transform((val) => {
        if (typeof val === 'bigint') {
          return [val];
        }
        return val;
      }),
      dateFrom: z
        .string()
        .datetime()
        .transform((date) => new Date(date)),
      dateTo: z
        .string()
        .datetime()
        .transform((date) => new Date(date)),
      archived: z.boolean(),
    })
    .partial()
    .refine(
      ({ dateFrom, dateTo }) => {
        if (dateFrom && dateTo && dateTo < dateFrom) {
          return false;
        }
        return true;
      },
      () => ({ message: 'dateTo has to be after dateFrom', path: ['dateTo'] })
    ),
};
const getAllRequestSchema = z.object(getAllRequestObject);
type QueryParams = z.infer<typeof getAllRequestObject.query>;

const createRequestObject = {
  body: z
    .object({
      activityId: bigintStringSchema,
      comment: stringNonEmptySchema.nullish(),
      startedAt: z.string().datetime(),
      stoppedAt: z.string().datetime().nullish(),
    })
    .refine(
      ({ stoppedAt, startedAt }) => {
        return !stoppedAt || new Date(stoppedAt) > new Date(startedAt);
      },
      () => ({
        message: `Stop time has to be after start time`,
        path: ['stoppedAt'],
      })
    ),
};
const createRequestSchema = z.object(createRequestObject);
type RecordCreate = z.infer<typeof createRequestObject.body>;

const updateRequestObject = {
  body: z
    .object({
      activityId: bigintStringSchema,
      comment: stringNonEmptySchema.nullish(),
      startedAt: z.string().datetime(),
      stoppedAt: z.string().datetime().nullish(),
    })
    .partial()
    .refine(
      ({ stoppedAt, startedAt }) =>
        !startedAt || !stoppedAt || new Date(stoppedAt) > new Date(startedAt),
      () => ({
        message: `Stop time has to be after start time`,
        path: ['stoppedAt'],
      })
    ),
  params: z.object({
    recordId: bigintStringSchema,
  }),
};
const updateRequestSchema = z.object(updateRequestObject);
type RecordUpdate = z.infer<typeof updateRequestObject.body>;

const deleteRequestObject = getRequestObject;
const deleteRequestSchema = z.object(deleteRequestObject);

const getCurrentGoalsRequestObject = {
  query: z.object({
    timezoneOffset: stringNonEmptySchema
      .regex(
        /^(0|(\+|-)\d{1,3}$)/,
        'Must be valid timezone offset number (whole number number postivie or negative or 0'
      )
      .max(4)
      .pipe(z.coerce.number().int()),
    // maybe set upper and lower limit for offset?
  }),
};
const getCurrentGoalsRequestSchema = z.object(getCurrentGoalsRequestObject);

const getStatisticsRequestObject = {
  body: z.object({
    timezoneOffset: stringNonEmptySchema
      .regex(
        /^(0|(\+|-)\d{1,3}$)/,
        'Must be valid timezone offset number (whole number number postivie or negative or 0'
      )
      .max(4)
      .pipe(z.coerce.number().int()),
  }),
  query: z
    .object({
      from: z
        .string()
        .datetime()
        .transform((date) => new Date(date)),
      to: z
        .string()
        .datetime()
        .transform((date) => new Date(date)),
      activityId: bigintStringSchema.or(z.array(bigintStringSchema)).transform((val) => {
        if (typeof val === 'bigint') {
          return [val];
        }
        return val;
      }),
    })
    .partial({ from: true, to: true, activityId: true })
    .refine(
      ({ from, to }) => {
        if (from && to && to < from) {
          return false;
        }
        return true;
      },
      () => ({ message: 'dateTo has to be after dateFrom', path: ['dateTo'] })
    ),
};
const getStatisticsRequestSchema = z.object(getStatisticsRequestObject);
type StatisticsQuery = z.infer<typeof getStatisticsRequestObject.query>;

export {
  // schemas
  getAllRequestSchema,
  getRequestSchema,
  getCurrentGoalsRequestSchema,
  getStatisticsRequestSchema,
  createRequestSchema,
  updateRequestSchema,
  deleteRequestSchema,

  // types
  StatisticsQuery,
  QueryParams,
  RecordCreate,
  RecordUpdate,
};
