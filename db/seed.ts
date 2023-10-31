import { proxy } from './proxy.js'
import { hashPassword } from '../server/hash.js'

// This file serve like the knex seed file.
//
// You can setup the database with initial config and sample data via the db proxy.

async function main() {
  proxy.user[1] = {
    username: 'alice',
    email: 'alice@example.com',
    tel: null,
    avatar: null,
    password_hash: await hashPassword('secret'),
  }
  proxy.user[2] = {
    username: 'bob',
    email: 'bob@example.com',
    tel: null,
    avatar: null,
    password_hash: await hashPassword('secret'),
  }
  proxy.calendar_event[1] = {
    user_id: 1,
    date: '1995-05-23',
    title: 'Java initial release',
  }
  proxy.calendar_event[2] = {
    user_id: 1,
    date: '1995-12-04',
    title: 'Javascript initial release',
  }
  proxy.calendar_event[3] = {
    user_id: 2,
    date: '2013-05-29',
    title: 'React initial release',
  }
}
main().catch(e => console.error(e))
