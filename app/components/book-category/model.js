const knex = require("../../../database/knex");

const bookCategoryModel = {
  async createBookCategory(input) {
    return await knex("book_category")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getBookCategory(id) {
    return await knex("book_category")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
  async getBookCategories() {
    return await knex("book_category")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async deleteBookCategory(id) {
    await knex("book_category").where("id", id).update("is_deleted", true);
  },
  // async updateSection(id, input) {
  //   return await knex("section")
  //     .where("id", id)
  //     .andWhere("is_deleted", false)
  //     .update({ ...input })
  //     .returning(["id"])
  //     .then((result) => result[0] || null);
  // },
};

module.exports = bookCategoryModel;
