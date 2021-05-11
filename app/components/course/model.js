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
  async getCourses() {
    return await knex("course")
      .where("is_deleted", false)
      .orderBy("created_at", "desc")
      .then((result) => result || []);
  },
  async deleteCourse(id) {
    await knex("course").where("id", id).update("is_deleted", true);
  },
  async updateCourse(id, input) {
    return await knex("course")
      .where("id", id)
      .andWhere("is_deleted", false)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0] || null);
  },
};

module.exports = courseModel;
