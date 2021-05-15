import apiService from "@/services/api-service";
import {
  CREATE_BOOK_CATEGORY,
  DELETE_BOOK_CATEGORY,
  GET_BOOK_CATEGORIES,
  UPDATE_BOOK_CATEGORY,
} from "@/store/modules/book-category/book-category-types";

const bookCategoryStore = {
  actions: {
    async [CREATE_BOOK_CATEGORY](_, { name, description }) {
      try {
        const response = await apiService.post("/book-category", {
          name,
          description,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_BOOK_CATEGORY](_, { id, name, description }) {
      try {
        const response = await apiService.put("/book-category", {
          id,
          name,
          description,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_BOOK_CATEGORIES]() {
      try {
        const response = await apiService.get("/book-category");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_BOOK_CATEGORY](_, id) {
      try {
        const response = await apiService.delete(`/book-category/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default bookCategoryStore;
