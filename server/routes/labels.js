import i18next from 'i18next';

export default (app) => app
  .get('/labels', { name: 'labels' }, async (req, reply) => {
    const labels = await app.objection.models.label.query();
    reply.render('labels/index', { labels });
    return reply;
  })
  .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
    reply.render('labels/new');
    return reply;
  })
  .post('/labels', async (req, reply) => {
    try {
      // const { id } = req.user;
      const label = await app.objection.models.label.fromJson(req.body.data);
      // const user = await app.objection.models.user.query().findById(id);
      await app.objection.models.label.query().insert(label);

      req.flash('info', i18next.t('flash.labels.create.success'));
      reply.redirect(app.reverse('labels'));
      return reply;
    } catch (err) {
      req.flash('error', i18next.t('flash.labels.create.error'));
      reply.render('labels/new', { user: req.body.data, errors: err.data });
      return reply;
    }
  })
  .get('/labels/:id/edit', { name: 'editLabel' }, async (req, reply) => {
    const { id } = req.params;
    const label = await app.objection.models.label.query().findById(id);
    reply.render('labels/edit', { label });
    return reply;
  })
  .patch('/labels/:id', { name: 'editLabelEndPoint' }, async (req, reply) => {
    const { id } = req.params;
    try {
      const patchForm = await app.objection.models.label.fromJson(req.body.data);
      const label = await app.objection.models.label.query().findById(id);

      await label.$query().update(patchForm);

      req.flash('info', i18next.t('flash.labels.edit.success'));
      reply.redirect(app.reverse('labels'));
      return reply;
    } catch ({ data }) {
      req.body.data.id = id;
      req.flash('error', i18next.t('flash.labels.edit.error'));
      reply.render('labels/edit', { label: req.body.data, errors: data });
      return reply;
    }
  })
  .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
    const { id } = req.params;
    try {
      await app.objection.models.label.query().deleteById(id);
      req.flash('info', i18next.t('flash.labels.delete.success'));
    } catch (error) {
      req.flash('error', i18next.t('flash.labels.delete.error'));
    }
    reply.redirect(app.reverse('labels'));
    return reply;
  });
