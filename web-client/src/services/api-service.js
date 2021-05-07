import Vue from "vue";
import axios from "axios";
import vueAxios from "vue-axios";
import localStorageService from "./local-storage-service";

const apiService = {
  init: () => {
    Vue.use(vueAxios, axios);
    Vue.axios.defaults.baseURL = `http://localhost:${
      process.env.PORT || 3000
    }/api`;
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorageService.get("access_token")}`;
  },

  get: (route, body) => {
    return Vue.axios.get(route, body);
  },

  post: (route, body) => {
    return Vue.axios.post(route, body);
  },

  put: (route, body) => {
    return Vue.axios.put(route, body);
  },

  delete: (route, body) => {
    return Vue.axios.delete(route, body);
  },
};

export default apiService;
