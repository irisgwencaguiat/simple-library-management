const knex = require("../../../database/knex");

const courseModel = {
  async createCourse(input) {
    return await knex("course")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getCourse(id) {
    return await knex("course")
      .where("is_deleted", false)
      .andWhere("id", id)
      .then((result) => result[0] || null);
  },
};

module.exports = courseModel;
