const collegeModel = require("./model");
const httpResource = require("../../http-resource");

const collegeController = {
  async createCollege(request, response) {
    try {
      const { name, short_name } = request.body;
      const college = await collegeModel.createCollege({ name, short_name });
      const collegeDetails = await collegeModel.getDetails(college.id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: collegeDetails,
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

module.exports = collegeController;
