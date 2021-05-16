exports.up = function (knex) {
  return knex.schema.createTable("login_activity", function (table) {
    table.increments();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("account_id").references("id").inTable("account");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("login_activity");
};
