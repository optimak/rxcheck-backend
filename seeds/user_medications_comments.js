
const userData = require('../seed-data/users.json');
const commentData = require('../seed-data/comments.json');
const medData = require('../seed-data/medications.json');
const userMedData = require('../seed-data/users_medications.json');

exports.seed = async function(knex) {
  await knex('comments').del();
  await knex('users_medications').del();
  await knex('medications').del();
  await knex('users').del();
  await knex('users').insert(userData);
  await knex('medications').insert(medData);
  await knex('users_medications').insert(userMedData);
  await knex('comments').insert(commentData);
  // Reset the id sequence after seeding
  await knex.raw(`SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id)+1, 1), false) FROM users;`);

};