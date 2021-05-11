exports.up = function (knex) {
  return knex.schema.createTable("section", function (table) {
    table.increments();
    table.string("name");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("course_id").references("id").inTable("course");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("section");
};
