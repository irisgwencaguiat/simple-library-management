import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";

const configurationStore = {
  state: {
    notificationSnackbar: { text: null, color: null },
  },

  mutations: {
    [SET_NOTIFICATION_SNACKBAR_CONFIGURATION](state, { text, color }) {
      state.notificationSnackbar = Object.assign({}, { text, color });
    },
  },
};

export default configurationStore;
