exports.up = function (knex) {
  return knex.schema.table("book", function (table) {
    table.string("preview_url");
  });
};

exports.down = function (knex) {
  return knex.schema.table("book", function (table) {
    table.dropColumn("preview_url");
  });
};
