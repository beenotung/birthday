import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('calendar_event')

  if (!(await knex.schema.hasTable('event_list'))) {
    await knex.schema.createTable('event_list', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.text('title').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('event_entity'))) {
    await knex.schema.createTable('event_entity', table => {
      table.increments('id')
      table.integer('event_list_id').unsigned().notNullable().references('event_list.id')
      table.text('title').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('event_date'))) {
    await knex.schema.createTable('event_date', table => {
      table.increments('id')
      table.integer('event_entity_id').unsigned().notNullable().references('event_entity.id')
      table.date('date').notNullable()
      table.text('title').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('event_date')
  await knex.schema.dropTableIfExists('event_entity')
  await knex.schema.dropTableIfExists('event_list')

  if (!(await knex.schema.hasTable('calendar_event'))) {
    await knex.schema.createTable('calendar_event', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.date('date').notNullable()
      table.text('title').notNullable()
      table.timestamps(false, true)
    })
  }
}
