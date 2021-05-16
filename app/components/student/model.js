const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
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
      .then((result) => result[0] || null);
  },

  async getStudents() {
    return await knex("student")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async getStudentByAccountId(account_id) {
    return await knex("student")
      .where("account_id", account_id)
      .andWhere("is_deleted", false)
      .then((result) => result[0] || null);
  },
  async deleteStudent(id) {
    await knex("student").where("id", id).update("is_deleted", true);
  },

  async updateStudent(id, input) {
    return await knex("student")
      .where("id", id)
      .andWhere("is_deleted", false)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0] || null);
  },
};

module.exports = studentModel;
