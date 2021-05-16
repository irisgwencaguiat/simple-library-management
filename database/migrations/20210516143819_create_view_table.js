exports.up = function (knex) {
  return knex.schema.createTable("view", function (table) {
    table.increments();
    table.integer("book_id").references("id").inTable("book");
    table.integer("account_id").references("id").inTable("account");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("view");
};
