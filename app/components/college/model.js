const knex = require("../../../database/knex");

const collegeModel = {
  async createCollege(input) {
    return await knex("college")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getDetails(id) {
    return await knex("college")
      .where("id", id)
      .then((result) => result[0] || null);
  },
  async getColleges() {
    return await knex("college")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async getCollege(id) {
    return await knex("college")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
};

module.exports = collegeModel;
