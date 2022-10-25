const BaseModel = require('./BaseModel.cjs');

module.exports = class LabelTask extends BaseModel {
  static get tableName() {
    return 'labels_tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['labelId', 'taskId'],
      properties: {
        id: { type: 'integer' },
        labelId: { type: 'integer' },
        taskId: { type: 'integer' },
      },
    };
  }
};