const courseModel = require("./model");
const collegeModel = require("../college/model");
const httpResource = require("../../http-resource");

const courseController = {
  async createCourse(request, response) {
    try {
      const { name, short_name, college_id } = request.body;
      const course = await courseModel.createCourse({
        name,
        short_name,
        college_id,
      });
      const courseDetails = await courseModel.getCourse(course.id);
      const college = await collegeModel.getCollege(courseDetails.college_id);
      courseDetails.college = Object.assign({}, college);
      delete courseDetails.college_id;
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: courseDetails,
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
  async getCourse(request, response) {
    try {
      const id = parseInt(request.params.id);
      const courseDetails = await courseModel.getCourse(id);
      if (courseDetails) {
        const college = await collegeModel.getCollege(courseDetails.college_id);
        courseDetails.college = Object.assign({}, college);
        delete courseDetails.college_id;
      }

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: courseDetails,
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
};

module.exports = courseController;
