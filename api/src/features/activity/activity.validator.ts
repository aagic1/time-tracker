import { z } from 'zod';

import { toStringFromInterval } from './activity.utils';
import {
  colorSchema,
  intervalSchema,
  booleanStringSchema,
  stringNonEmptySchema,
} from '../../utils/schemas';

// ZOD schema definitions for validating incoming HTTP request data (body, params and query)
// and
// types infered from given definitions

const getAllRequestObject = {
  query: z
    .object({
      archived: booleanStringSchema,
    })
    .partial(),
};
const getAllRequestSchema = z.object(getAllRequestObject);
type FiltersActivities = z.infer<typeof getAllRequestObject.query>;

const getRequestObject = {
  params: z.object({
    activityName: stringNonEmptySchema,
  }),
};
const getRequestSchema = z.object(getRequestObject);

const createRequestObject = {
  body: z.object({
    name: stringNonEmptySchema,
    color: colorSchema,
    sessionGoal: intervalSchema.nullish().transform((val) => toStringFromInterval(val)),
    dayGoal: intervalSchema.nullish().transform((val) => toStringFromInterval(val)),
    weekGoal: intervalSchema.nullish().transform((val) => toStringFromInterval(val)),
    monthGoal: intervalSchema.nullish().transform((val) => toStringFromInterval(val)),
  }),
};
const createRequestSchema = z.object(createRequestObject);
type ActivityCreate = z.infer<typeof createRequestObject.body>;

const updateRequestObject = {
  body: createRequestObject.body
    .partial()
    .merge(
      z.object({ archived: z.boolean().optional(), dateArchived: z.string().datetime().optional() })
    )
    .refine(
      ({ archived, dateArchived }) =>
        archived == null || (archived != null && dateArchived != null),
      { message: 'Specify date when activity was archived', path: ['dateArchived'] }
    ),
  params: z.object({
    activityName: stringNonEmptySchema,
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
  FiltersActivities,
};
