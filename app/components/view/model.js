const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const viewModel = {
  async createBookView(input) {
    return await knex("view")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getBookViewTotalCount(id) {
    return await knex("view")
      .count("id")
      .where("is_deleted", false)
      .andWhere("book_id", id)
      .then((result) => parseInt(result[0].count));
  },
  async doesViewExist(book_id, account_id) {
    return await knex("view")
      .where("book_id", book_id)
      .andWhere("account_id", account_id)
      .then((result) => result[0] || null);
  },
};

module.exports = viewModel;
