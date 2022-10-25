export const up = (knex) => (
    knex.schema.createTable('labels_tasks', (table) => {
      table.increments('id').primary();
      table.integer('label_id').references('id').inTable('labels').notNullable();
      table.integer('task_id').references('id').inTable('tasks').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }));
  
  export const down = (knex) => knex.schema.dropTable('labels_tasks');