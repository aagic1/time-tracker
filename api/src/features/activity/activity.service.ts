import { objectToSnake } from 'ts-case-convert';
import { NotFoundError } from '../../errors/not-found-error';
import activityDAO from './activity.dao';
import { ActivityCreate, FiltersActivities, ActivityUpdate } from './activity.validator';
import { CreationError } from '../../errors/creation-error';

async function getAllActivities(userId: bigint, filters: FiltersActivities) {
  const activities = await activityDAO.findAll(userId, filters);
  return activities;
}

async function getActivity(userId: bigint, activityName: string) {
  const activity = await activityDAO.findOneByName(userId, activityName);
  if (!activity) {
    throw new NotFoundError(`Activity with name ${activityName} not found`);
  }
  return activity;
}

async function createActivity(userId: bigint, activity: ActivityCreate) {
  const newActivity = await activityDAO.create(objectToSnake({ ...activity, accountId: userId }));
  if (!newActivity) {
    throw new CreationError('Failed to create activity.');
  }
  return newActivity;
}

async function updateActivity(userId: bigint, activityName: string, activityData: ActivityUpdate) {
  const updatedActivity = await activityDAO.update(
    userId,
    activityName,
    objectToSnake(activityData)
  );
  if (!updatedActivity) {
    throw new NotFoundError(
      `Failed to update activity. Activity with name ${activityName} not found.`
    );
  }
  return updatedActivity;
}

async function deleteActivity(userId: bigint, activityName: string) {
  const result = await activityDAO.remove(userId, activityName);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(
      `Failed to delete activity. Activity with name=${activityName} not found.`
    );
  }
}

export default { getAllActivities, getActivity, createActivity, updateActivity, deleteActivity };
