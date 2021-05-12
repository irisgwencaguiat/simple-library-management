import apiService from "@/services/api-service";
import {
  CREATE_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
} from "@/store/modules/course/course-types";

const courseStore = {
  actions: {
    async [CREATE_COURSE](_, { name, shortName }) {
      try {
        const response = await apiService.post("/course", {
          name,
          short_name: shortName,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_COURSE](_, { id, name, shortName }) {
      try {
        const response = await apiService.put("/course", {
          id,
          name,
          short_name: shortName,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_COURSES]() {
      try {
        const response = await apiService.get("/course");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_COURSE](_, id) {
      try {
        const response = await apiService.delete(`/course/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default courseStore;
