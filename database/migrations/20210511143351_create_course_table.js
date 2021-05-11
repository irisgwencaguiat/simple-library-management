exports.up = function (knex) {
  return knex.schema.createTable("course", function (table) {
    table.increments();
    table.string("name");
    table.string("short_name");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("college_id").references("id").inTable("college");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("course");
};
