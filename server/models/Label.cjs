const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({
  fields: ['name'],
});

module.exports = class Label extends unique(BaseModel) {
  // @ts-ignore
  static get tableName() {
    return 'labels';
  }
  // @ts-ignore
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',

        join: {
          from: 'labels.creator_id',
          to: 'users.id',
        },
      },
    };
  }
}