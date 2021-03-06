import apiService from "@/services/api-service";
import {
  CHANGE_ACCOUNT_PASSWORD,
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  UPDATE_ACCOUNT,
} from "@/store/modules/account/account-types";
import { AUTHENTICATION_CHANGE_PASSWORD } from "@/store/modules/authentication/authentication-types";

const accountStore = {
  actions: {
    async [CREATE_ACCOUNT](
      _,
      { firstName, lastName, type, username, password }
    ) {
      try {
        const response = await apiService.post("/account", {
          first_name: firstName,
          last_name: lastName,
          account_type: type,
          username,
          password,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_ACCOUNT](_, { id, firstName, lastName }) {
      try {
        const response = await apiService.put("/account", {
          id,
          first_name: firstName,
          last_name: lastName,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_ACCOUNTS](_, filter) {
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        const response = await apiService.get("/account", { params });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_ACCOUNT](_, id) {
      try {
        const response = await apiService.delete(`/account/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
    async [CHANGE_ACCOUNT_PASSWORD]({ commit }, { oldPassword, newPassword }) {
      try {
        const response = await apiService.put("/account/password", {
          old_password: oldPassword,
          new_password: newPassword,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default accountStore;
