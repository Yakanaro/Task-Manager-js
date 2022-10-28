import _ from 'lodash';
import { faker } from '@faker-js/faker';

import encrypt from '../../server/lib/secure.cjs';

const generators = {
  user: () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),
  status: () => ({
    name: faker.word.adjective(),
  }),
  task: () => ({
    name: faker.word.verb(),
    description: faker.lorem.text(),
  }),
  label: () => ({
    name: faker.word.noun(),
  }),
};

export function createRandomData(type, length = 1) {
  const data = [];
  const generateData = generators[type];

  Array.from({ length }).forEach(() => {
    data.push(generateData());
  });

  return data;
}

export const generateUsersData = () => {
  const newUsers = createRandomData('user');
  const existedUsers = createRandomData('user', 3);
  const seeds = existedUsers.map((user) => ({
    ..._.omit(user, 'password'),
    passwordDigest: encrypt(user.password),
  }));

  return {
    new: newUsers[0],
    existing: {
      creator: existedUsers[0],
      executor: existedUsers[1],
      free: existedUsers[2],
    },
    seeds,
  };
};

export const generateStatusesData = () => {
  const newStatuses = createRandomData('status');
  const existedStatuses = createRandomData('status', 2);

  return {
    new: newStatuses[0],
    existing: {
      busy: existedStatuses[0],
      free: existedStatuses[1],
    },
    seeds: existedStatuses,
  };
};

export const generateTasksData = (users, statuses) => {
  const [creator, executor] = users;
  const [status] = statuses;

  const mapTasks = (task) => ({
    ...task,
    creatorId: creator.id,
    executorId: executor.id,
    statusId: status.id,
  });

  const newTasks = createRandomData('task').map(mapTasks);
  const existedTasks = createRandomData('task').map(mapTasks);
  return { new: newTasks[0], existing: existedTasks[0], seeds: existedTasks };
};

export const generateLabelsData = () => {
  const newLabels = createRandomData('label');
  const existedLabels = createRandomData('label', 2);

  return {
    new: newLabels[0],
    existing: {
      busy: existedLabels[0],
      free: existedLabels[1],
    },
    seeds: existedLabels,
  };
};
