import apiService from "@/services/api-service";
import {
  CREATE_STUDENT,
  DELETE_STUDENT,
  GET_STUDENTS,
  UPDATE_STUDENT,
} from "@/store/modules/student/student-types";

const studentStore = {
  actions: {
    async [CREATE_STUDENT](_, { name, shortName, courseId }) {
      try {
        const response = await apiService.post("/student", {
          name,
          short_name: shortName,
          course_id: courseId,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_STUDENT](_, { id, name, shortName, courseId }) {
      try {
        const response = await apiService.put("/student", {
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

    async [GET_STUDENTS]() {
      try {
        const response = await apiService.get("/student");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_STUDENT](_, id) {
      try {
        const response = await apiService.delete(`/student/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default studentStore;
