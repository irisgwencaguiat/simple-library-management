exports.up = function (knex) {
  return knex.schema.createTable("book", function (table) {
    table.increments();
    table.string("name");
    table.string("description", 1000);
    table.string("url");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("book_category_id").references("id").inTable("book_category");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("book");
};
