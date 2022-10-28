import fastify from 'fastify';

import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll,
} from '@jest/globals';
import init from '../server/plugin.js';
import { prepareData, authUser } from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const params = testData.labels.existing.free;
    const label = await models.label.query().findOne({ name: params.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id: label.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.label.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('update', async () => {
    const params = testData.labels.existing.free;
    const status = await models.label.query().findOne({ name: params.name });
    const newStatusName = 'New status';

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editLabelEndPoint', { id: status.id }),
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
    const params = testData.labels.existing.free;
    const label = await models.label.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    const reFetchedStatus = await label.$query();
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
