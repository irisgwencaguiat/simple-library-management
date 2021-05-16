const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const loginActivityModel = {
  async createLoginActivity(input) {
    return await knex("login_activity")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getLogInActivityCountPerDay(date) {
    return await knex("login_activity")
      .countDistinct("account_id")
      .where("created_at", ">=", `${date}:00:00:00`)
      .andWhere("created_at", "<=", `${date}:23:59:59`)
      .then((result) => parseInt(result[0].count));
  },
  async getCourseLogInActivityCountPerDay(course_id, date) {
    return await knex("login_activity")
      .countDistinct("account_id")
      .where("course_id", course_id)
      .andWhere("created_at", ">=", `${date}:00:00:00`)
      .andWhere("created_at", "<=", `${date}:23:59:59`)
      .then((result) => parseInt(result[0].count));
  },
};

module.exports = loginActivityModel;
