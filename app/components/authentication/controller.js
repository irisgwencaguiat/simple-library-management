const accountModel = require("../account/model");
const loginActivityModel = require("../login-activity/model");
const utilityController = require("../utility/controller");
const studentModel = require("../student/model");
const courseModel = require("../course/model");
const jsonwebtoken = require("jsonwebtoken");
const httpResource = require("../../http-resource");

const authenticationController = {
  async logIn(request, response) {
    try {
      const { username, password } = request.body;

      const gotAccountDetails = await accountModel.getDetailsByUsername(
        username
      );
      if (!gotAccountDetails) throw `${username} does not exists.`;
      const accountPassword = await accountModel.getPassword(
        gotAccountDetails.id
      );
      const isPlainTextValidated = utilityController.validateHashPassword(
        password,
        accountPassword
      );
      if (!isPlainTextValidated) throw "Incorrect Password";
      delete gotAccountDetails.password;
      const details = await accountModel.getDetails(gotAccountDetails.id);
      delete details.password;
      const token = jsonwebtoken.sign(
        details,
        process.env.AUTHENTICATION_SECRET_OR_KEY
      );
      if (details.account_type === "student") {
        const student = await studentModel.getStudentByAccountId(details.id);
        await loginActivityModel.createLoginActivity({
          account_id: details.id,
          course_id: student.course_id || null,
        });
      }
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Logged in successfully.",
          data: {
            user: details,
            access_token: token,
          },
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
  async getLogInActivityCountPerDay(request, response) {
    try {
      const { date } = request.params;
      const count = await loginActivityModel.getLogInActivityCountPerDay(date);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record retrieve successfully.",
          data: {
            login_count: count,
          },
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
  async getCourseLogInActivityCountPerDay(request, response) {
    try {
      const { date } = request.params;
      const courses = await courseModel.getCourses();
      const coursesDetails = await Promise.all(
        courses.map(async (data) => {
          const course = data;

          const count = await loginActivityModel.getCourseLogInActivityCountPerDay(
            course.id,
            date
          );
          return {
            course,
            login_count: count,
          };
        })
      );

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record retrieve successfully.",
          data: coursesDetails,
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

module.exports = authenticationController;
