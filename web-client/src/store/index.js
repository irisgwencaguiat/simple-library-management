import Vue from "vue";
import Vuex from "vuex";
import authenticationStore from "@/store/modules/authentication/authentication-store";
import accountStore from "@/store/modules/account/account-store";
import configurationStore from "@/store/modules/configuration/configuration-store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication: authenticationStore,
    account: accountStore,
    configuration: configurationStore,
  },
});
