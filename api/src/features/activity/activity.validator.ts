import { z } from 'zod';

import { toStringFromInterval } from './activity.utils';
import { colorSchema, intervalSchema } from '../../utils/schemas';

// ZOD schema definitions for validating incoming HTTP request data (body, params and query) and
// types infered from given definitions

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
const getAllRequestSchema = z.object(getAllRequestObject);
type ActivityFilters = z.infer<typeof getAllRequestObject.query>;

const getRequestObject = {
  params: z.object({
    activityName: z.string().trim().min(1),
  }),
};
const getRequestSchema = z.object(getRequestObject);

const createRequestObject = {
  body: z.object({
    name: z.string().min(1),
    color: colorSchema,
    sessionGoal: intervalSchema.transform((val) => toStringFromInterval(val)).nullish(),
    dayGoal: intervalSchema.transform((val) => toStringFromInterval(val)).nullish(),
    weekGoal: intervalSchema.transform((val) => toStringFromInterval(val)).nullish(),
    monthGoal: intervalSchema.transform((val) => toStringFromInterval(val)).nullish(),
  }),
};
const createRequestSchema = z.object(createRequestObject);
type ActivityCreate = z.infer<typeof createRequestObject.body>;

const updateRequestObject = {
  body: createRequestObject.body.partial().merge(z.object({ archived: z.boolean().optional() })),
  params: z.object({
    activityName: z.string().trim().min(1),
  }),
};
const updateRequestSchema = z.object(updateRequestObject);
type ActivityUpdate = z.infer<typeof updateRequestObject.body>;

const deleteRequestObject = getRequestObject;
const deleteRequestSchema = z.object(deleteRequestObject);

export {
  // validation schemas
  getAllRequestSchema,
  getRequestSchema,
  createRequestSchema,
  updateRequestSchema,
  deleteRequestSchema,

  // types
  ActivityCreate,
  ActivityUpdate,
  ActivityFilters,
};
