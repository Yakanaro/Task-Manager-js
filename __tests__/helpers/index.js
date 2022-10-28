// @ts-check

import { URL } from 'url';
import fs from 'fs';
import path from 'path';

import {
  generateUsersData,
  generateStatusesData,
  generateTasksData,
  generateLabelsData,
} from './generationData.js';

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
// prettier-ignore
const readFixture = (filename) => (
  fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim()
);
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app) => {
  const { knex } = app.objection;
  const usersData = generateUsersData();
  const statusesData = generateStatusesData();
  const labelsData = generateLabelsData();

  await knex('users').insert(usersData.seeds);
  await knex('task_statuses').insert(statusesData.seeds);
  await knex('labels').insert(labelsData.seeds);

  const users = await knex('users');
  const statuses = await await knex('task_statuses');
  const tasksData = generateTasksData(users, statuses);
  await knex('tasks').insert(tasksData.seeds);

  return {
    users: usersData,
    statuses: statusesData,
    tasks: tasksData,
    labels: labelsData,
  };
};

export const authUser = async (app, user) => {
  // аутентификация
  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: { data: user },
  });

  // после успешной аутентификации получаем куки из ответа
  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };

  return cookie;
};
