export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.integer('status_id').references('id').inTable('task_statuses').notNullable();
    table.integer('creator_id').references('id').inTable('users').notNullable();
    table.integer('executor_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }));

export const down = (knex) => knex.schema.dropTable('tasks');
