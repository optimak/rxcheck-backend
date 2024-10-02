/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments('id').primary();
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table.integer("age").notNullable().defaultTo(0);
      table.string("gender").notNullable().defaultTo('other');
      table.string("password").notNullable();
      table.string("preexisting_conditions").notNullable().defaultTo('none');
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now());
      table
        .string("last_login").defaultTo('');

    })
    .createTable("medications", (table) => {
      table.increments('id').primary();
      table.string("name").notNullable();
      table.string("active_ingredient").notNullable();
      table.string("indications").notNullable();
      table.string("side_effects").notNullable();
      table.string("food_interactions").defaultTo('none');
      table.string("contra_indications").notNullable().defaultTo('none');

    })

    .createTable("comments", (table) => {
      table.increments('id').primary();
      table.string("content", 1000).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("medication_id")
        .unsigned()
        .references("medications.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now());
    })
    .createTable("users_medications", (table) => {
      table.increments('id').primary();
      table
        .integer("medication_id")
        .unsigned()
        .references("medications.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");


    })
    ;




};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("comments")
    .dropTable("users_medications")
    .dropTable("medications").dropTable("users");

};

