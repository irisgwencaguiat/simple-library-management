const bookModel = require("./model");
const bookCategoryModel = require("../book-category/model");
const cloudinaryController = require("../cloudinary/controller");
const httpResource = require("../../http-resource");

const bookController = {
  async createBook(request, response) {
    try {
      const { name, description, book_category_id } = request.body;

      const bookFile = request.file || null;
      const uploadedBook = await cloudinaryController.upload(bookFile, "books");

      const book = await bookModel.createBook({
        name,
        description: description || null,
        book_category_id: parseInt(book_category_id),
        url: uploadedBook.url,
      });
      const details = await bookModel.getBook(book.id);
      const bookCategory = await bookCategoryModel.getBookCategory(
        details.book_category_id
      );
      details.book_category = Object.assign({}, bookCategory);
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
  // async getBookCategory(request, response) {
  //   try {
  //     const id = parseInt(request.params.id);
  //
  //     const details = await bookCategoryModel.getBookCategory(id);
  //
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: details,
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
  // async getBookCategories(request, response) {
  //   try {
  //     const bookCategories = await bookCategoryModel.getBookCategories();
  //     let bookCategoriesDetails = [];
  //     if (bookCategories.length > 0) {
  //       bookCategoriesDetails = await Promise.all(
  //         bookCategories.map(async (data) => {
  //           const bookCategory = await bookCategoryModel.getBookCategory(
  //             data.id
  //           );
  //           return bookCategory;
  //         })
  //       );
  //     }
  //
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: bookCategoriesDetails,
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
  // async deleteBookCategory(request, response) {
  //   try {
  //     const id = parseInt(request.params.id);
  //     await bookCategoryModel.deleteBookCategory(id);
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
  // async updateBookCategoryDetails(request, response) {
  //   try {
  //     const { id, name, description } = request.body;
  //     const payload = {};
  //     if (name) payload.name = name;
  //     if (description) payload.description = description;
  //     const updatedBookCategory = await bookCategoryModel.updateBookCategoryDetails(
  //       id,
  //       payload
  //     );
  //     const bookCategory = await bookCategoryModel.getBookCategory(
  //       updatedBookCategory.id
  //     );
  //     response.status(200).json(
  //       httpResource({
  //         success: true,
  //         code: 200,
  //         message: "Record has been created successfully.",
  //         data: bookCategory,
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

module.exports = bookController;