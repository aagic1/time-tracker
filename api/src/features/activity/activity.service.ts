import { objectToSnake } from 'ts-case-convert';
import { NotFoundError } from '../../errors/not-found.error';
import activityDAO from './activity.dao';
import { ActivityCreate, ActivityFilters, ActivityUpdate } from './activity.validator';

async function getAllActivities(userId: bigint, filters: ActivityFilters) {
  // try catch
  const activities = await activityDAO.findAll(userId, filters);
  return activities;
}

async function getActivity(userId: bigint, activityName: string) {
  const activity = await activityDAO.findOneByName(userId, activityName);
  if (!activity) {
    throw new NotFoundError(`Activity with id ${activityName} not found`);
  }
  return activity;
}

async function createActivity(userId: bigint, activity: ActivityCreate) {
  const newActivity = await activityDAO.create(objectToSnake({ ...activity, accountId: userId }));
  if (!newActivity) {
    // better error handling
    throw `Failed to create activity. Server error`;
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
    throw `Failed to update activity. Server error`;
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
