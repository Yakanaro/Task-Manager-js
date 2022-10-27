import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData, authUser } from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('taskStatuses'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const params = testData.statuses.existing.free;
    const status = await models.taskStatus.query().findOne({ name: params.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id: status.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('taskStatuses'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.taskStatus.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('update', async () => {
    const params = testData.statuses.existing.free;
    const status = await models.taskStatus.query().findOne({ name: params.name });
    const newStatusName = 'New status';

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editStatusEndPoint', { id: status.id }),
      payload: {
        data: {
          ...params,
          name: newStatusName,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const reFetchedStatus = await status.$query();
    expect(reFetchedStatus.name).toEqual(newStatusName);
  });

  it('delete', async () => {
    const params = testData.statuses.existing.free;
    const status = await models.taskStatus.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    const reFetchedStatus = await status.$query();
    expect(reFetchedStatus).toBeUndefined();
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