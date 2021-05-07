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
      .then((result) => result[0]);
  },
};

module.exports = collegeModel;
