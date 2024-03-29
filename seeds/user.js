const userData = require('../seed-data/users.json');

console.log(userData)

exports.seed = async function(knex) {
  await knex('users').del();
  await knex('users').insert(userData);

};