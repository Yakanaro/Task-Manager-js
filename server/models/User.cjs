// @ts-check

const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');
const encrypt = require('../lib/secure.cjs');


const unique = objectionUnique({ fields: ['email'] });

module.exports = class User extends unique(BaseModel) {
  // @ts-ignore
  static get tableName() {
    return 'users';
  }

  // @ts-ignore
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: {type: 'string', minLength:1},
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  // @ts-ignore
  static get relationMappings() {
    return {
      statuses: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Status.cjs',

        join: {
          from: 'users.id',
          to: 'statuses.creator_id',
        },
      },
    }
  }
  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
};
