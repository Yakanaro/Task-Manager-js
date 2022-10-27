import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData, authUser } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  let testData;

  beforeAll(async () => {
    app = fastify();
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    testData = await prepareData(app);
    cookie = await authUser(app, testData.users.existing.creator);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('view', async () => {
    const params = testData.tasks.existing;
    const task = await models.task.query().findOne({ name: params.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('viewTask', { id: task.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const params = testData.tasks.existing;
    const task = await models.task.query().findOne({ name: params.name });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: task.id }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toMatchObject(params);
  });

  it('update', async () => {
    const params = testData.tasks.existing;
    const task = await models.task.query().findOne({ name: params.name });
    const newTaskName = 'New task name';

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editTaskEndPoint', { id: task.id }),
      payload: {
        data: {
          ...params,
          name: newTaskName,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const reFetchedTask = await task.$query();
    expect(reFetchedTask.name).toEqual(newTaskName);
  });

  it('delete', async () => {
    const params = testData.tasks.existing;
    const task = await models.task.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    const reFetchedTask = await task.$query();
    expect(reFetchedTask).toBeUndefined();
  });

  afterEach(async () => {
    await models.user.query().truncate();
    await models.taskStatus.query().truncate();
    await models.task.query().truncate();
    await models.label.query().truncate();
    await models.labelTask.query().truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});