exports.up = function (knex) {
  return knex.schema.createTable("student", function (table) {
    table.increments();
    table.string("student_number");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("account_id").references("id").inTable("account");
    table.integer("college_id").references("id").inTable("college");
    table.integer("course_id").references("id").inTable("course");
    table.integer("section_id").references("id").inTable("section");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("student");
};
