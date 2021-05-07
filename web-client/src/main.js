import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import vuetify from "@/plugins/vuetify";
import apiService from "@/services/api-service";

Vue.config.productionTip = false;
apiService.init();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
