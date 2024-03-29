/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("users", (table) => {
        table.increments('id').primary();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.integer("age").notNullable().defaultTo(0);
        table.string("gender").notNullable().defaultTo('other');
        table.string("password").notNullable();
        table.string("preexisting_conditions").notNullable();
       
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
