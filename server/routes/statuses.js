// import i18next from 'i18next';

// export default (app) => app
//   .get('/statuses', { name: 'statuses' }, async (req, reply) => {
//     const statuses = await app.objection.models.status.query();
//     reply.render('statuses/index', { statuses });
//     return reply;
//   })
//   .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
//     reply.render('statuses/new');
//     return reply;
//   })
//   .post('/statuses', async (req, reply) => {
//     try {
//       const { id } = req.user;
//       const { models } = app.objection;
//       const status = await models.status.fromJson(req.body.data);
//       const user = await models.user.query().findById(id);
//       await app.objection.models.status.query().insert(status);
//       req.flash('info', i18next.t('flash.statuses.create.success'));
//       reply.redirect(app.reverse('statuses'));
//       return reply;
//     } catch (error) {
//       console.log(error);
//       req.flash('error', i18next.t('flash.statuses.create.error'));
//       reply.render('statuses/new', { user: req.body.data, errors: error.data });
//       return reply;
//     }
//   })
//   .get('/statuses/:id/edit', {name: 'editStatus'}, async (req, reply) => {
//     const { id } = req.params;
//     const status = await app.objection.models.status.query().findById(id);
//     reply.render('statuses/edit', { status });
//     return reply;
//   })
//   .patch('/statuses/:id', {name: 'editStatusEndPoint'}, async (req, reply) => {
//     const { id } = req.params;
//     try {
//       const { models } = app.objection;
//       const patchForm = await models.status.fromJson(req.body.data);
//       const status = await models.status.query().findById(id);
//       await status.$query().update(patchForm);
//       req.flash('info', i18next.t('flash.statuses.edit.success'));
//       reply.redirect(app.reverse('statuses'));
//       return reply;
//     } catch ({ data }) {
//       req.body.data.id = id;
//       req.flash('error', i18next.t('flash.statuses.edit.error'));
//       reply.render('statuses/edit', { status: req.body.data, errors: data });
//       return reply;
//     }
//   })
//   .delete('/statuses/:id', {name: 'deleteStatus'}, async (req, reply) => {
//     const { id } = req.params;
//     await app.objection.models.status.query().deleteById(id);
//     req.flash('info', i18next.t('flash.statuses.delete.success'));
//     reply.redirect(app.reverse('statuses'));
//     return reply;
//   });
import i18next from 'i18next';

export default (app) => {
  app
    .get(
      '/statuses',
      { name: 'taskStatuses', preValidation: app.authenticate },
      async (req, reply) => {
        const statuses = await app.objection.models.taskStatus.query();
        reply.render('statuses/index', { statuses });
        return reply;
      },
    )

    .get(
      '/statuses/new',
      { name: 'newStatus', preValidation: app.authenticate },
      (req, reply) => {
        const status = new app.objection.models.taskStatus();
        reply.render('statuses/new', { status });
      },
    )

    .get(
      '/statuses/:id/edit',
      { name: 'editStatus', preValidation: app.authenticate },
      async (req, reply) => {
        const statusId = req.params.id;
        const status = await app.objection.models.taskStatus.query().findById(statusId);

        reply.render('statuses/edit', { status });
        return reply;
      },
    )

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

    .patch(
      '/statuses/:id',
      { name: 'editStatusEndPoint', preValidation: app.authenticate },
      async (req, reply) => {
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
      },
    )

    .delete(
      '/statuses/:id',
      { name: 'deleteStatus', preValidation: app.authenticate },
      async (req, reply) => {
        const statusId = req.params.id;
        const hasTask = await app.objection.models.task.query().findOne({ statusId });

        if (hasTask) {
          req.flash('error', i18next.t('flash.statuses.delete.error'));
          return reply.redirect(app.reverse('taskStatuses'));
        }

        await app.objection.models.taskStatus.query().deleteById(statusId);
        req.flash('info', i18next.t('flash.statuses.delete.success'));

        return reply.redirect(app.reverse('taskStatuses'));
      },
    );
};