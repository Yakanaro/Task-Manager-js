/* eslint-disable new-cap */

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })

    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })

    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const currentUserId = req.user.id;

      if (userId !== currentUserId) {
        req.flash('error', i18next.t('flash.accessDenied'));
        return reply.redirect(app.reverse('users'));
      }

      const user = await app.objection.models.user.query().findById(userId);
      reply.render('users/edit', { user });
      return reply;
    })

    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })

    .patch('/users/:id', { name: 'editUserEndPoint', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const user = await app.objection.models.user.query().findById(userId);
      const currentUserId = req.user.id;

      if (userId !== currentUserId) {
        return app.httpErros.forbidden();
      }

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await user.$query().update(validUser);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/edit', { user, errors: data });
      }

      return reply;
    })

    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const currentUser = req.user;

      if (userId !== currentUser.id) {
        req.flash('error', i18next.t('flash.accessDenied'));
        return reply.redirect(app.reverse('users'));
      }

      const busyTasks = await app.objection.models.task
        .query()
        .where({ executorId: userId })
        .orWhere({ creatorId: userId });

      if (busyTasks.length > 0) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }

      req.logOut();
      await app.objection.models.user.query().deleteById(userId);
      req.flash('info', i18next.t('flash.users.delete.success'));
      return reply.redirect(app.reverse('users'));
    });
};
