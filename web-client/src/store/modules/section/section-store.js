import apiService from "@/services/api-service";
import {
  CREATE_SECTION,
  DELETE_SECTION,
  GET_SECTIONS,
  UPDATE_SECTION,
} from "@/store/modules/section/section-types";

const sectionStore = {
  actions: {
    async [CREATE_SECTION](_, { name, shortName, courseId }) {
      try {
        const response = await apiService.post("/section", {
          name,
          short_name: shortName,
          course_id: courseId,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_SECTION](_, { id, name, shortName, courseId }) {
      try {
        const response = await apiService.put("/section", {
          id,
          name,
          short_name: shortName,
          course_id: courseId,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_SECTIONS]() {
      try {
        const response = await apiService.get("/section");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_SECTION](_, id) {
      try {
        const response = await apiService.delete(`/section/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default sectionStore;
