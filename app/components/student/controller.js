const studentModel = require("./model");
const utilityController = require("../utility/controller");
const accountModel = require("../account/model");
const collegeModel = require("../college/model");
const courseModel = require("../course/model");
const sectionModel = require("../section/model");
const httpResource = require("../../http-resource");

const studentController = {
  async createStudent(request, response) {
    try {
      const {
        first_name,
        last_name,
        account_type,
        student_number,
        college_id,
        course_id,
        section_id,
      } = request.body;
      const doesUsernameExist = await accountModel.getDetailsByUsername(
        student_number
      );
      if (doesUsernameExist) throw `${student_number} already exists.`;
      const accountRegisterResult = await accountModel.createAccount({
        first_name,
        last_name,
        username: student_number,
        password: utilityController.hashPassword(student_number),
        account_type,
      });

      const student = await studentModel.createStudent({
        student_number,
        account_id: accountRegisterResult.id,
        college_id,
        course_id,
        section_id,
      });
      const details = await studentModel.getStudent(student.id);
      const account = await accountModel.getDetails(details.account_id);
      const college = await collegeModel.getCollege(details.college_id);
      const course = await courseModel.getCourse(details.course_id);
      const section = await sectionModel.getSection(details.section_id);
      details.account = Object.assign({}, account);
      details.college = Object.assign({}, college);
      details.course = Object.assign({}, course);
      details.section = Object.assign({}, section);
      delete details.account_id;
      delete details.college_id;
      delete details.course_id;
      delete details.section_id;
      delete details.account.password;
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
  async getStudents(request, response) {
    try {
      const students = await studentModel.getStudents();
      const studentsDetails = await Promise.all(
        students.map(async (data) => {
          const details = data;
          const account = await accountModel.getDetails(details.account_id);
          const college = await collegeModel.getCollege(details.college_id);
          const course = await courseModel.getCourse(details.course_id);
          const section = await sectionModel.getSection(details.section_id);
          details.account = Object.assign({}, account);
          details.college = Object.assign({}, college);
          details.course = Object.assign({}, course);
          details.section = Object.assign({}, section);
          delete details.account_id;
          delete details.college_id;
          delete details.course_id;
          delete details.section_id;
          delete details.account.password;
          return details;
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: studentsDetails,
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
  async getStudent(request, response) {
    try {
      const id = parseInt(request.params.id);
      const details = await studentModel.getStudent(id);
      const account = await accountModel.getDetails(details.account_id);
      const college = await collegeModel.getCollege(details.college_id);
      const course = await courseModel.getCourse(details.course_id);
      const section = await sectionModel.getSection(details.section_id);
      details.account = Object.assign({}, account);
      details.college = Object.assign({}, college);
      details.course = Object.assign({}, course);
      details.section = Object.assign({}, section);
      delete details.account_id;
      delete details.college_id;
      delete details.course_id;
      delete details.section_id;
      delete details.account.password;
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
  async deleteStudent(request, response) {
    try {
      const id = parseInt(request.params.id);
      const studentDetails = await studentModel.getStudent(id);
      await accountModel.deleteAccount(studentDetails.account_id);
      await studentModel.deleteStudent(id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: null,
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
  // async updateUserDetails(request, response) {
  //   try {
  //     const { id, first_name, last_name } = request.body;
  //     const payload = {};
  //     if (first_name) payload.first_name = first_name;
  //     if (last_name) payload.last_name = last_name;
  //     const updatedAccount = await accountModel.updateAccount(id, payload);
  //     if (!updatedAccount) throw "Account cannot be found.";
  //     const accountDetails = await accountModel.getDetails(updatedAccount.id);
  //     delete accountDetails.password;
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: accountDetails,
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

module.exports = studentController;
