exports.up = function (knex) {
  return knex.schema.createTable("book_category", function (table) {
    table.increments();
    table.string("name");
    table.string("description");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("book_category");
};
