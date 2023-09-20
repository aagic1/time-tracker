import { db } from '../db';

async function findById() {
  return 'find record by id';
}

async function find() {
  return 'find all records';
}

async function remove() {
  return 'delete record';
}

async function create() {
  return 'create record';
}

async function update() {
  return 'update record';
}

export default {
  findById,
  find,
  remove,
  create,
  update,
};
