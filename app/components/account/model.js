const knex = require("../../../database/knex");

const accountModel = {
  async getDetails(id) {
    return await knex("account")
      .where("id", id)
      .then((result) => result[0]);
  },

  async getDetailsByUsername(username) {
    return await knex("account")
      .where("username", username)
      .then(async (result) => result[0] || null);
  },

  async getPassword(id) {
    return await knex("account")
      .select(["password"])
      .where("id", id)
      .then((result) => result[0].password || null);
  },
};

module.exports = accountModel;
