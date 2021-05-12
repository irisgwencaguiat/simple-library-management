const knex = require("../../../database/knex");

const studentModel = {
  async createStudent(input) {
    return await knex("student")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getStudent(id) {
    return await knex("student")
      .where("id", id)
      .andWhere("is_deleted", false)
      .then((result) => result[0]);
  },

  async getStudents() {
    return await knex("student")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },

  async deleteStudent(id) {
    await knex("student").where("id", id).update("is_deleted", true);
  },

  // async updateAccount(id, input) {
  //   return await knex("account")
  //     .where("id", id)
  //     .andWhere("is_deleted", false)
  //     .update({ ...input })
  //     .returning(["id"])
  //     .then((result) => result[0] || null);
  // },
};

module.exports = studentModel;
