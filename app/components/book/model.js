const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const bookModel = {
  async createBook(input) {
    return await knex("book")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getBook(id) {
    return await knex("book")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
  async getBooks() {
    return await knex("book")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async deleteBook(id) {
    await knex("book").where("id", id).update("is_deleted", true);
  },
  async updateBookDetails(id, input) {
    return await knex("book")
      .where("id", id)
      .andWhere("is_deleted", false)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0] || null);
  },
  async getBooksByCategory(id) {
    return await knex("book")
      .where("is_deleted", false)
      .andWhere("book_category_id", id)
      .then((result) => result || []);
  },
};

module.exports = bookModel;
