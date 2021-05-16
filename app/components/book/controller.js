const bookModel = require("./model");
const bookCategoryModel = require("../book-category/model");
const viewModel = require("../view/model");
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
      delete details.book_category_id;
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
  async getBook(request, response) {
    try {
      const id = parseInt(request.params.id);

      const details = await bookModel.getBook(id);
      const bookCategory = await bookCategoryModel.getBookCategory(
        details.book_category_id
      );
      details.book_category = Object.assign({}, bookCategory);
      delete details.book_category_id;

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
  async getBooks(request, response) {
    try {
      const books = await bookModel.getBooks();
      let booksDetails = [];
      if (books.length > 0) {
        booksDetails = await Promise.all(
          books.map(async (data) => {
            const details = await bookModel.getBook(data.id);
            const bookCategory = await bookCategoryModel.getBookCategory(
              details.book_category_id
            );
            details.book_category = Object.assign({}, bookCategory);
            delete details.book_category_id;

            return details;
          })
        );
      }

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: booksDetails,
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
  async deleteBook(request, response) {
    try {
      const id = parseInt(request.params.id);
      await bookModel.deleteBook(id);
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
  async updateBookDetails(request, response) {
    try {
      const { id, name, description, book_category_id } = request.body;
      const bookFile = request.file || null;
      const uploadedBook = await cloudinaryController.upload(bookFile, "books");

      const payload = {};
      if (name) payload.name = name;
      if (description) payload.description = description;
      if (book_category_id)
        payload.book_category_id = parseInt(book_category_id);
      if (bookFile) payload.url = uploadedBook.url;
      const updatedBook = await bookModel.updateBookDetails(
        parseInt(id),
        payload
      );
      const details = await bookModel.getBook(updatedBook.id);
      const bookCategory = await bookCategoryModel.getBookCategory(
        details.book_category_id
      );
      details.book_category = Object.assign({}, bookCategory);
      delete details.book_category_id;

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
  async createBookView(request, response) {
    try {
      const { id, account_id } = request.body;
      const doesViewExist = await viewModel.doesViewExist(id, account_id);
      if (!doesViewExist) {
        await viewModel.createBookView({
          book_id: id,
          account_id,
        });
      }

      const bookView = await viewModel.getBookViewTotalCount(id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: bookView,
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
  async mostViewedBook(request, response) {
    try {
      const books = await bookModel.getBooks();
      const booksDetails = await Promise.all(
        books.map(async (data) => {
          const book = data;
          const bookCategory = await bookCategoryModel.getBookCategory(
            book.book_category_id
          );
          book.book_category = Object.assign({}, bookCategory);
          book.view = await viewModel.getBookViewTotalCount(data.id);
          delete book.book_category_id;
          return book;
        })
      );
      const sortedBooks = await booksDetails.sort((a, b) => {
        if (a.view > b.view) return -1;
        if (a.view < b.view) return 1;
        if (a.view === b.view) return 0;
      });

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: sortedBooks,
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

module.exports = bookController;
