import apiService from "@/services/api-service";
import {
  BOOK_VIEW,
  CREATE_BOOK,
  DELETE_BOOK,
  GET_BOOK_VIEW,
  GET_BOOKS,
  UPDATE_BOOK,
} from "@/store/modules/book/book-types";

const bookStore = {
  actions: {
    async [CREATE_BOOK](
      _,
      { name, description, bookCategoryId, file, preview }
    ) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("book_category_id", bookCategoryId);
        formData.append("book", file);
        formData.append("preview", preview);
        const response = await apiService.post("/book", formData);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_BOOK](
      _,
      { id, name, description, bookCategoryId, file, preview }
    ) {
      try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("book_category_id", bookCategoryId);
        formData.append("preview", preview);
        if (file) formData.append("book", file);
        const response = await apiService.put("/book", formData);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_BOOKS]() {
      try {
        const response = await apiService.get("/book");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_BOOK_VIEW]() {
      try {
        const response = await apiService.get("/book/view");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [BOOK_VIEW](_, { bookId, accountId }) {
      try {
        const response = await apiService.post("/book/view", {
          id: bookId,
          account_id: accountId,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_BOOK](_, id) {
      try {
        const response = await apiService.delete(`/book/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default bookStore;
