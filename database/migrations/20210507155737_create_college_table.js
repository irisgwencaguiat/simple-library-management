exports.up = function (knex) {
  return knex.schema.createTable("college", function (table) {
    table.increments();
    table.string("name");
    table.string("short_name");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("college");
};
