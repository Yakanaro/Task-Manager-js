/* eslint-disable import/extensions */
// @ts-check

import { fileURLToPath } from 'url';
import path from 'path';
// @ts-ignore
import fastifyStatic from 'fastify-static';
// @ts-ignore
import fastifyErrorPage from 'fastify-error-page';
// @ts-ignore
import Rollbar from 'rollbar';

// @ts-ignore
import pointOfView from 'point-of-view';
// @ts-ignore
import fastifyFormbody from 'fastify-formbody';
// @ts-ignore
import fastifySecureSession from 'fastify-secure-session';
// @ts-ignore
import fastifyPassport from 'fastify-passport';
// @ts-ignore
import fastifySensible from 'fastify-sensible';
// @ts-ignore
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
// @ts-ignore
import fastifyMethodOverride from 'fastify-method-override';
// @ts-ignore
import fastifyObjectionjs from 'fastify-objectionjs';
// @ts-ignore
import qs from 'qs';
import Pug from 'pug';
// @ts-ignore
import i18next from 'i18next';
// @ts-ignore
import ru from './locales/ru.js';
// @ts-ignore

import addRoutes from './routes/index.js';
// @ts-ignore
import getHelpers from './helpers/index.js';
// @ts-ignore
import * as knexConfig from '../knexfile.js';
// @ts-ignore
import models from './models/index.js';
// @ts-ignore
import FormStrategy from './lib/passportStrategies/FormStrategy.js';

// @ts-ignore
const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';
// const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      // debug: isDevelopment,
      resources: {
        ru,
      },
    });
};

const setupErrorHandler = (app) => {
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  app.setErrorHandler((error) => {
    rollbar.error(error);
  });

  return app;
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };

    req.query = qs.parse(req.query);
  });
};

const registerPlugins = (app) => {
  app.register(fastifySensible);
  app.register(fastifyErrorPage);
  app.register(fastifyReverseRoutes);
  app.register(fastifyFormbody, { parser: qs.parse });
  app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  // @ts-ignore
  fastifyPassport.registerUserDeserializer(
    (user) => app.objection.models.user.query().findById(user.id),
  );
  // @ts-ignore
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  // @ts-ignore
  fastifyPassport.use(new FormStrategy('form', app));
  // @ts-ignore
  app.register(fastifyPassport.initialize());
  // @ts-ignore
  app.register(fastifyPassport.secureSession());
  app.decorate('fp', fastifyPassport);
  // @ts-ignore
  app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: app.reverse('root'),
      failureFlash: i18next.t('flash.authError'),
    },
  // @ts-ignore
  )(...args));

  app.register(fastifyMethodOverride);
  app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

// eslint-disable-next-line no-unused-vars
// @ts-ignore
// @ts-ignore
export default async (app, options) => {
  registerPlugins(app);

  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);
  setupErrorHandler(app);

  return app;
};
