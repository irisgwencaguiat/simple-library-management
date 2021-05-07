import apiService from "@/services/api-service";
import {
  CREATE_COLLEGE,
  DELETE_COLLEGE,
  GET_COLLEGES,
  UPDATE_COLLEGE,
} from "@/store/modules/college/college-types";

const collegeStore = {
  actions: {
    async [CREATE_COLLEGE](_, { name, shortName }) {
      try {
        const response = await apiService.post("/college", {
          name,
          short_name: shortName,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_COLLEGE](_, { id, firstName, lastName }) {
      try {
        const response = await apiService.put("/college", {
          id,
          first_name: firstName,
          last_name: lastName,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_COLLEGES](_, filter) {
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        const response = await apiService.get("/college", { params });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_COLLEGE](_, id) {
      try {
        const response = await apiService.delete(`/college/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default collegeStore;
