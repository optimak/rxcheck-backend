/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("medications", (table) => {
        table.increments('id').primary();
        table.string("name").notNullable();
        table.string("active_ingredient").notNullable();
        table.string("indications").notNullable();
        table.string("side_effects").notNullable();
        table.string("food_interactions").defaultTo('none');
        table.string("contra_indications").notNullable().defaultTo('none');
       
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("medications")

};
