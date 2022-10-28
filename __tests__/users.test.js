import _ from 'lodash';
import fastify from 'fastify';
import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll,
} from '@jest/globals';
import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { prepareData, authUser } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = fastify({ logger: { prettyPrint: true } });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    testData = await prepareData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const params = testData.users.existing.creator;
    const user = await models.user.query().findOne({ email: params.email });
    const cookie = await authUser(app, params);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.users.existing.creator;
    const user = await models.user.query().findOne({ email: params.email });
    const newEmail = 'new@example.com';
    const cookie = await authUser(app, params);

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editUserEndPoint', { id: user.id }),
      payload: {
        data: {
          ...params,
          firstName: newEmail,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const reFetchedUser = await user.$query();
    expect(reFetchedUser.firstName).toEqual(newEmail);
  });

  it('delete', async () => {
    const params = testData.users.existing.free;
    const user = await models.user.query().findOne({ email: params.email });
    const cookie = await authUser(app, params);

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    const reFetchedUser = await user.$query();
    expect(reFetchedUser).toBeUndefined();
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
