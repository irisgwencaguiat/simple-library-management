const knex = require("../../../database/knex");

const collegeModel = {
  async createCollege(input) {
    return await knex("college")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
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
  async deleteCollege(id) {
    await knex("college").where("id", id).update("is_deleted", true);
  },
  async updateCollege(id, input) {
    return await knex("college")
      .where("id", id)
      .andWhere("is_deleted", false)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0] || null);
  },
};

module.exports = collegeModel;
