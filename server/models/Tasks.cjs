const { Model } = require('objection');
const _ = require('lodash');

const BaseModel = require('./BaseModel.cjs');
const TaskStatus = require('./TaskStatus.cjs');
const User = require('./User.cjs');
const Label = require('./Label.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
      },
    };
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    const converted = {
      ...json,
      statusId: _.toInteger(json.statusId) || null,
      creatorId: _.toInteger(json.creatorId) || null,
      executorId: _.toInteger(json.executorId),
    };

    return converted;
  }

  static modifiers = {
    async filter(query, filterParams = {}, userId) {
      const { status, executor, label, isCreatorUser } = filterParams;

      query
        .skipUndefined()
        .where('statusId', status || undefined)
        .andWhere('executorId', executor || undefined)
        .andWhere('labels.id', label || undefined)
        .andWhere('creatorId', isCreatorUser ? userId : undefined);
    },
  };

  static get relationMappings() {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaskStatus,
        join: {
          from: 'tasks.statusId',
          to: 'task_statuses.id',
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'labels_tasks.taskId',
            to: 'labels_tasks.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }
};