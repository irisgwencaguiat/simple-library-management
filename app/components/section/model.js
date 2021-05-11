const knex = require("../../../database/knex");

const sectionModel = {
  async createSection(input) {
    return await knex("section")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getSection(id) {
    return await knex("section")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
  async getSections() {
    return await knex("section")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async deleteSection(id) {
    await knex("section").where("id", id).update("is_deleted", true);
  },
  async updateSection(id, input) {
    return await knex("section")
      .where("id", id)
      .andWhere("is_deleted", false)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0] || null);
  },
};

module.exports = sectionModel;
