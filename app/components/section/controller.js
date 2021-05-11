const sectionModel = require("./model");
const courseModel = require("../course/model");
const collegeModel = require("../college/model");
const httpResource = require("../../http-resource");

const sectionController = {
  async createSection(request, response) {
    try {
      const { name, course_id } = request.body;
      const section = await sectionModel.createSection({
        name,
        course_id,
      });
      const sectionDetails = await sectionModel.getSection(section.id);
      const course = await courseModel.getCourse(sectionDetails.course_id);
      const college = await collegeModel.getCollege(course.college_id);
      sectionDetails.course = Object.assign({}, course);
      sectionDetails.course.college = Object.assign({}, college);
      delete sectionDetails.course_id;
      delete sectionDetails.course.college_id;
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: sectionDetails,
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
  async getSection(request, response) {
    try {
      const id = parseInt(request.params.id);
      const sectionDetails = await sectionModel.getSection(id);
      if (sectionDetails) {
        const course = await courseModel.getCourse(sectionDetails.course_id);
        const college = await collegeModel.getCollege(course.college_id);
        sectionDetails.course = Object.assign({}, course);
        sectionDetails.course.college = Object.assign({}, college);
        delete sectionDetails.course_id;
        delete sectionDetails.course.college_id;
      }

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: sectionDetails,
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
  // async getCourses(request, response) {
  //   try {
  //     const courses = await courseModel.getCourses();
  //     let coursesDetails = [];
  //     if (courses.length > 0) {
  //       coursesDetails = await Promise.all(
  //         courses.map(async (data) => {
  //           const course = data;
  //
  //           const college = await collegeModel.getCollege(course.college_id);
  //           course.college = Object.assign({}, college);
  //           delete course.college_id;
  //           return course;
  //         })
  //       );
  //     }
  //
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: coursesDetails,
  //       })
  //     );
  //   } catch (error) {
  //     response.status(400).json(
  //       httpResource({
  //         success: false,
  //         code: 400,
  //         message: error,
  //       })
  //     );
  //   }
  // },
  // async deleteCourse(request, response) {
  //   try {
  //     const id = parseInt(request.params.id);
  //     await courseModel.deleteCourse(id);
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: null,
  //       })
  //     );
  //   } catch (error) {
  //     response.status(400).json(
  //       httpResource({
  //         success: false,
  //         code: 400,
  //         message: error,
  //       })
  //     );
  //   }
  // },
  // async updateCourseDetails(request, response) {
  //   try {
  //     const { id, name, short_name, college_id } = request.body;
  //     const payload = {};
  //     if (name) payload.name = name;
  //     if (short_name) payload.short_name = short_name;
  //     if (college_id) payload.college_id = college_id;
  //     const updatedCourse = await courseModel.updateCourse(id, payload);
  //     const course = await courseModel.getCourse(updatedCourse.id);
  //     const college = await collegeModel.getCollege(course.college_id);
  //     course.college = Object.assign({}, college);
  //     delete course.college_id;
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: course,
  //       })
  //     );
  //   } catch (error) {
  //     response.status(400).json(
  //       httpResource({
  //         success: false,
  //         code: 400,
  //         message: error,
  //       })
  //     );
  //   }
  // },
};

module.exports = sectionController;
