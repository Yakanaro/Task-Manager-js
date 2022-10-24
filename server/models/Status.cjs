const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({
  fields: ['name'],
});

module.exports = class Status extends unique(BaseModel) {
  // @ts-ignore
  static get tableName() {
    return 'statuses';
  }
  // @ts-ignore
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        creatorId: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string' },
      },
    };
  }
  // @ts-ignore
  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',

        join: {
          from: 'statuses.creator_id',
          to: 'users.id',
        },
      },
    };
  }
};
