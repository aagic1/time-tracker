import { z } from 'zod';
import { getDayNumber, getDaysInMonth } from './record.utils';

const MAX_BIGINT_POSTGRES = 9223372036854775807n;

const stringNonEmptySchema = z.string().trim().min(1, 'Required');

const dateWithoutTimeSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Invalid date format. Enter the date in the format YYYY-MM-DD'
  )
  .transform((dateString, ctx) => {
    const date = new Date(dateString);
    if (isNaN(date.getDate())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
      });
      return z.NEVER;
    }
    return date;
  });

const bigintStringSchema = stringNonEmptySchema.transform((val, ctx) => {
  try {
    const id = BigInt(val);
    if (id <= 0) {
      throw '';
    }
    return id;
  } catch (err) {
    console.log('zooooooooooooooooood', err);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide positive whole number',
    });
    return z.NEVER;
  }
});

const booleanStringSchema = z
  .enum(['true', 'false'], {
    errorMap: () => ({
      message: 'Archived has to be either true or false.',
    }),
  })
  .transform((archived) => archived === 'true');

const getRequestObject = {
  params: z.object({
    recordId: bigintStringSchema,
  }),
};
export const getRequestSchema = z.object(getRequestObject);
export type GetRequest = z.infer<typeof getRequestSchema>;

const getAllRequestObject = {
  query: z
    .object({
      active: booleanStringSchema,
      comment: stringNonEmptySchema,
      activityId: bigintStringSchema
        .or(z.array(bigintStringSchema))
        .transform((val) => {
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
export const getAllRequestSchema = z.object(getAllRequestObject);
export type GetAllRequest = z.infer<typeof getAllRequestSchema>;
export type QueryParams = z.infer<typeof getAllRequestObject.query>;

const createRequestObject = {
  body: z
    .object({
      activityId: bigintStringSchema,
      comment: stringNonEmptySchema.nullable().optional(),
      startedAt: z.string().datetime(),
      stoppedAt: z.string().datetime().nullable().optional(),
    })
    .refine(
      ({ stoppedAt, startedAt }) => {
        return !stoppedAt || new Date(stoppedAt) > new Date(startedAt);
      },
      () => ({
        message: `Stop time has to be after start time`,
        path: ['stoppedAt'],
      })
    )
    .refine(
      ({ stoppedAt, startedAt }) => {
        if (!stoppedAt) {
          return new Date(startedAt) < new Date();
        }
        return true;
      },
      () => ({
        message: 'Start time of active record can not be in the future',
        path: ['startTime'],
      })
    ),
};
export const createRequestSchema = z.object(createRequestObject);
export type CreateRequest = z.infer<typeof createRequestSchema>;

const updateRequestObject = {
  body: z
    .object({
      activityId: bigintStringSchema,
      comment: stringNonEmptySchema.nullable().optional(),
      startedAt: z.string().datetime(),
      stoppedAt: z.string().datetime().nullable().optional(),
    })
    .partial()
    .refine(
      ({ stoppedAt, startedAt }) =>
        !startedAt || !stoppedAt || new Date(stoppedAt) > new Date(startedAt),
      () => ({
        message: `Stop time has to be after start time`,
        path: ['stoppedAt'],
      })
    )
    .refine(
      ({ stoppedAt, startedAt }) => {
        if (stoppedAt === null && startedAt) {
          return new Date(startedAt) < new Date();
        }
        return true;
      },
      () => ({
        message: 'Start time of active record can not be in the future',
        path: ['startTime'],
      })
    ),
  params: z.object({
    recordId: bigintStringSchema,
  }),
};
export const updateRequestSchema = z.object(updateRequestObject);
export type UpdateRequest = z.infer<typeof updateRequestSchema>;

const deleteRequestObject = getRequestObject;
export const deleteRequestSchema = z.object(deleteRequestObject);
export type DeleteRequest = z.infer<typeof deleteRequestSchema>;

function isValidDayOfMonth(year: number, month: number, dayOfMonth: number) {
  return dayOfMonth <= getDaysInMonth(month, year);
}

const getCurrentGoalsRequestObject = {
  // maybe check if supplied date is current date, npr date1hourAgo > suppliedDate > date1hourAfter...
  query: z
    .object({
      year: stringNonEmptySchema
        .regex(/^\d{1,4}$/, 'Must be number representing year')
        .pipe(z.coerce.number().int()),
      month: stringNonEmptySchema
        .regex(/^\d{1,2}$/, 'Must be number from 1 to 12 representing month')
        .pipe(z.coerce.number().int().min(1).max(12)),
      // maybe set upper and lower limit?
      dayOfMonth: stringNonEmptySchema
        .regex(/^\d{1,2}$/, 'Must be valid number representing day of month')
        .pipe(z.coerce.number().int().min(1).max(31)),
      timezoneOffset: stringNonEmptySchema
        .regex(/^(0|(\+|-)\d{1,3}$)/, 'Must be valid timezone offset number')
        .max(4)
        .pipe(z.coerce.number().int()),
      // maybe set upper and lower limit?
    })
    .superRefine((val, ctx) => {
      if (!isValidDayOfMonth(val.year, val.month, val.dayOfMonth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'Invalid number of days in month',
        });
      }
    }),
  // params: z
  //   .object({
  //     dateDayTz: stringNonEmptySchema
  //       .regex(
  //         /^\d{4}-\d{2}-\d{2},[a-zA-z]{3},(0|(\+|-)[1-9]\d{1,2})$/,
  //         'Enter in format: yyyy-mm-dd,DAY,timezoneoffset'
  //       )
  //       .transform((val, ctx) => {
  //         const [dateString, day, timezoneOffset] = val.split(',');
  //         const [year, month, date] = dateString.split('-');
  //         const dayNumber = getDayNumber(day);
  //         if (dayNumber === -1) {
  //           ctx.addIssue({
  //             code: z.ZodIssueCode.custom,
  //             message: 'Not a valid day',
  //           });
  //           return z.NEVER;
  //         }
  //         const dateObject = {
  //           year: Number.parseInt(year),
  //           monthIndex: Number.parseInt(month) - 1,
  //           date: Number.parseInt(date),
  //           day: getDayNumber(day),
  //           timezoneOffset: Number.parseInt(timezoneOffset),
  //         };
  //         return dateObject;
  //       }),
  //   })
};
export const getCurrentGoalsRequestSchema = z.object(
  getCurrentGoalsRequestObject
);
export type getCurrentGoalsRequest = z.infer<
  typeof getCurrentGoalsRequestSchema
>;
