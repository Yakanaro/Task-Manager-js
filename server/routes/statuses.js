/* eslint-disable new-cap */
import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'taskStatuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.taskStatus.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })

    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new app.objection.models.taskStatus();
      reply.render('statuses/new', { status });
    })

    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const statusId = req.params.id;
      const status = await app.objection.models.taskStatus.query().findById(statusId);

      reply.render('statuses/edit', { status });
      return reply;
    })

    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new app.objection.models.taskStatus();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('taskStatuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })

    .patch('/statuses/:id', { name: 'editStatusEndPoint', preValidation: app.authenticate }, async (req, reply) => {
      const statusId = req.params.id;
      const status = await app.objection.models.taskStatus.query().findById(statusId);

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(
          req.body.data,
        );
        await status.$query().update(validStatus);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('taskStatuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', { status, errors: data });
      }

      return reply;
    })

    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      const statusId = req.params.id;
      const hasTask = await app.objection.models.task.query().findOne({ statusId });

      if (hasTask) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        return reply.redirect(app.reverse('taskStatuses'));
      }

      await app.objection.models.taskStatus.query().deleteById(statusId);
      req.flash('info', i18next.t('flash.statuses.delete.success'));

      return reply.redirect(app.reverse('taskStatuses'));
    });
};
