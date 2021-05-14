const bookCategoryModel = require("./model");
const httpResource = require("../../http-resource");

const bookCategoryController = {
  async createBookCategory(request, response) {
    try {
      const { name, description } = request.body;
      const bookCategory = await bookCategoryModel.createBookCategory({
        name,
        description: description || null,
      });
      const details = await bookCategoryModel.getBookCategory(bookCategory.id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: details,
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
  // async getSection(request, response) {
  //   try {
  //     const id = parseInt(request.params.id);
  //     const sectionDetails = await sectionModel.getSection(id);
  //     if (sectionDetails) {
  //       const course = await courseModel.getCourse(sectionDetails.course_id);
  //       const college = await collegeModel.getCollege(course.college_id);
  //       sectionDetails.course = Object.assign({}, course);
  //       sectionDetails.course.college = Object.assign({}, college);
  //       delete sectionDetails.course_id;
  //       delete sectionDetails.course.college_id;
  //     }
  //
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: sectionDetails,
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
  // async getSections(request, response) {
  //   try {
  //     const sections = await sectionModel.getSections();
  //     let sectionsDetails = [];
  //     if (sections.length > 0) {
  //       sectionsDetails = await Promise.all(
  //         sections.map(async (data) => {
  //           const section = data;
  //           const course = await courseModel.getCourse(section.course_id);
  //           const college = await collegeModel.getCollege(course.college_id);
  //           section.course = Object.assign({}, course);
  //           section.course.college = Object.assign({}, college);
  //           delete section.course_id;
  //           delete section.course.college_id;
  //           return section;
  //         })
  //       );
  //     }
  //
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: sectionsDetails,
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
  // async deleteSection(request, response) {
  //   try {
  //     const id = parseInt(request.params.id);
  //     await sectionModel.deleteSection(id);
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
  // async updateSectionDetails(request, response) {
  //   try {
  //     const { id, name, course_id } = request.body;
  //     const payload = {};
  //     if (name) payload.name = name;
  //     if (course_id) payload.course_id = course_id;
  //     const updatedSection = await sectionModel.updateSection(id, payload);
  //     const section = await sectionModel.getSection(updatedSection.id);
  //     const course = await courseModel.getCourse(section.course_id);
  //     const college = await collegeModel.getCollege(course.college_id);
  //     section.course = Object.assign({}, course);
  //     section.course.college = Object.assign({}, college);
  //     delete section.course_id;
  //     delete section.course.college_id;
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: section,
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

module.exports = bookCategoryController;
