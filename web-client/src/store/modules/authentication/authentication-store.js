import localStorageService from "@/services/local-storage-service";
import apiService from "@/services/api-service";
import {
  AUTHENTICATION_LOGIN,
  PURGE_AUTHENTICATION_DETAILS,
  REFRESH_AUTHENTICATION_DETAILS,
  SET_AUTHENTICATION_DETAILS,
} from "@/store/modules/authentication/authentication-types";

const authenticationStore = {
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
  },

  mutations: {
    [SET_AUTHENTICATION_DETAILS](state, { user, token }) {
      console.log({ user, token });
      state.user = Object.assign({}, user);
      state.token = token;
      state.isAuthenticated = true;
      localStorageService.save("user", JSON.stringify(user));
      localStorageService.save("access_token", token);
    },

    [PURGE_AUTHENTICATION_DETAILS](state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorageService.remove("user");
      localStorageService.remove("access_token");
    },
  },

  actions: {
    async [AUTHENTICATION_LOGIN]({ commit }, { username, password }) {
      try {
        const response = await apiService.post("/authentication/log-in", {
          username,
          password,
        });
        const result = response.data;
        const { user, token } = result.data;
        commit(SET_AUTHENTICATION_DETAILS, { user, token });
        return result;
      } catch (error) {
        commit(PURGE_AUTHENTICATION_DETAILS);
        return error.response.data;
      }
    },

    async [REFRESH_AUTHENTICATION_DETAILS]({ commit }) {
      try {
        const token = localStorageService.get("access_token");
        const user = Object.assign(
          {},
          JSON.parse(localStorageService.get("user"))
        );
        if (!token) return commit(PURGE_AUTHENTICATION_DETAILS);
        commit(SET_AUTHENTICATION_DETAILS, { token, user });
      } catch (_) {
        commit(PURGE_AUTHENTICATION_DETAILS);
      }
    },
  },
};

export default authenticationStore;
