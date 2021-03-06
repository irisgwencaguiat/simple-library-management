const collegeModel = require("./model");
const httpResource = require("../../http-resource");

const collegeController = {
  async createCollege(request, response) {
    try {
      const { name, short_name } = request.body;
      const college = await collegeModel.createCollege({ name, short_name });
      const collegeDetails = await collegeModel.getCollege(college.id);
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
  async getColleges(request, response) {
    try {
      const colleges = await collegeModel.getColleges();
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: colleges,
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
  async getCollegeById(request, response) {
    try {
      const id = parseInt(request.params.id);
      const college = await collegeModel.getCollege(id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: college,
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
  async deleteCollege(request, response) {
    try {
      const id = parseInt(request.params.id);
      await collegeModel.deleteCollege(id);
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
  async updateCollegeDetails(request, response) {
    try {
      const { id, name, short_name } = request.body;
      const payload = {};
      if (name) payload.name = name;
      if (short_name) payload.short_name = short_name;
      const updatedCollege = await collegeModel.updateCollege(id, payload);
      const collegeDetails = await collegeModel.getCollege(updatedCollege.id);
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
