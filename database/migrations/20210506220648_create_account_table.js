exports.up = function (knex) {
  return knex.schema.createTable("account", function (table) {
    table.increments();
    table.string("first_name");
    table.string("last_name");
    table.string("username");
    table.string("password");
    table.string("account_type");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("account");
};
