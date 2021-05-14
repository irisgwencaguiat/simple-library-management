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
  async getBookCategory(request, response) {
    try {
      const id = parseInt(request.params.id);

      const details = await bookCategoryModel.getBookCategory(id);

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
  async getBookCategories(request, response) {
    try {
      const bookCategories = await bookCategoryModel.getBookCategories();
      let bookCategoriesDetails = [];
      if (bookCategories.length > 0) {
        bookCategoriesDetails = await Promise.all(
          bookCategories.map(async (data) => {
            const bookCategory = await bookCategoryModel.getBookCategory(
              data.id
            );
            return bookCategory;
          })
        );
      }

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: bookCategoriesDetails,
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
  async deleteBookCategory(request, response) {
    try {
      const id = parseInt(request.params.id);
      await bookCategoryModel.deleteBookCategory(id);
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
  async updateBookCategoryDetails(request, response) {
    try {
      const { id, name, description } = request.body;
      const payload = {};
      if (name) payload.name = name;
      if (description) payload.description = description;
      const updatedBookCategory = await bookCategoryModel.updateBookCategoryDetails(
        id,
        payload
      );
      const bookCategory = await bookCategoryModel.getBookCategory(
        updatedBookCategory.id
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: bookCategory,
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

module.exports = bookCategoryController;
