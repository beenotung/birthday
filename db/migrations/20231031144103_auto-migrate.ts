import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

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


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('calendar_event')
}
