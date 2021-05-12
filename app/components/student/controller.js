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
  async updateStudentDetails(request, response) {
    try {
      const {
        id,
        first_name,
        last_name,
        student_number,
        college_id,
        course_id,
        section_id,
      } = request.body;
      const studentDetails = await studentModel.getStudent(id);
      const accountPayload = {};
      const studentPayload = {};

      if (first_name) accountPayload.first_name = first_name;
      if (last_name) accountPayload.last_name = last_name;

      if (student_number) studentPayload.student_number = student_number;
      if (college_id) studentPayload.college_id = college_id;
      if (course_id) studentPayload.course_id = course_id;
      if (section_id) studentPayload.section_id = section_id;

      let newUpdate = {};
      if (!utilityController.isObjectEmpty(accountPayload)) {
        const updatedAccount = await accountModel.updateAccount(
          studentDetails.account_id,
          accountPayload
        );
        newUpdate.account_id = updatedAccount.id;
      }
      if (!utilityController.isObjectEmpty(studentPayload)) {
        const updatedStudent = await studentModel.updateStudent(
          id,
          studentPayload
        );
        newUpdate.student_id = updatedStudent.id;
      }
      const details = await studentModel.getStudent(newUpdate.student_id);
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
};

module.exports = studentController;
