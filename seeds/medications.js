const medData = require('../seed-data/medications.json');

console.log(medData)

exports.seed = async function(knex) {
  await knex('medications').del();
  await knex('medications').insert(medData);

};