const knex = require("../../../database/knex");

const accountModel = {
  async createAccount(input) {
    return await knex("account")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
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

  async getAccounts() {
    return await knex("account")
      .where("is_deleted", false)
      .then((result) => result || []);
  },

  async getAccountById(id) {
    return await knex("account")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
};

module.exports = accountModel;
