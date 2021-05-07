import apiService from "@/services/api-service";
import { CREATE_ACCOUNT } from "@/store/modules/account/account-types";

const accountStore = {
  mutations: {},

  actions: {
    async [CREATE_ACCOUNT](
      { commit },
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
  },
};

export default accountStore;
