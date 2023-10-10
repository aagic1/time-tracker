import { z } from 'zod';

import { toStringFromInterval } from './activity.utils';

const intervalSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
  })
  .partial()
  .refine(({ hours, minutes, seconds }) => hours || minutes || seconds, {
    message: 'At least one field must be defined and greater than 0',
  });

const colorSchema = z
  .string()
  .length(7)
  .regex(/^#[A-Fa-f0-9]{6}$/, 'String must match hexadecimal color code')
  .transform((reg) => reg.slice(1));

const createRequestObject = {
  body: z.object({
    name: z.string().min(1),
    color: colorSchema,
    sessionGoal: intervalSchema
      .transform((val) => toStringFromInterval(val))
      .nullish(),
    dayGoal: intervalSchema
      .transform((val) => toStringFromInterval(val))
      .nullish(),
    weekGoal: intervalSchema
      .transform((val) => toStringFromInterval(val))
      .nullish(),
    monthGoal: intervalSchema
      .transform((val) => toStringFromInterval(val))
      .nullish(),
  }),
};
export const createRequestSchema = z.object(createRequestObject);
export type CreateRequest = z.infer<typeof createRequestSchema>;

const updateRequestObject = {
  body: createRequestObject.body
    .partial({
      name: true,
      color: true,
    })
    .merge(z.object({ archived: z.boolean().optional() })),
  params: z.object({
    activityName: z.string().trim().min(1),
  }),
};
export const updateRequestSchema = z.object(updateRequestObject);
export type UpdateRequest = z.infer<typeof updateRequestSchema>;

const getRequestObject = {
  params: z.object({
    activityName: z.string().trim().min(1),
  }),
};
export const getRequestSchema = z.object(getRequestObject);
export type GetRequest = z.infer<typeof getRequestSchema>;

const deleteRequestObject = getRequestObject;
export const deleteRequestSchema = z.object(deleteRequestObject);
export type DeleteRequest = z.infer<typeof deleteRequestSchema>;

const getAllRequestObject = {
  query: z
    .object({
      archived: z
        .enum(['true', 'false'], {
          errorMap: () => ({
            message: 'Archived has to be either true or false.',
          }),
        })
        .transform((archived) => archived === 'true'),
    })
    .partial(),
};
export const getAllRequestSchema = z.object(getAllRequestObject);
export type GetAllRequest = z.infer<typeof getAllRequestSchema>;
