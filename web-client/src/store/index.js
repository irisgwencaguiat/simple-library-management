import Vue from "vue";
import Vuex from "vuex";
import authenticationStore from "@/store/modules/authentication/authentication-store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication: authenticationStore,
  },
});
