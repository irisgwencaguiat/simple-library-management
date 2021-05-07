<template>
  <v-snackbar
    v-model="isOpenLocal"
    :color="colorLocal"
    multi-line
    :timeout="timeout"
  >
    {{ textLocal }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="isOpenLocal = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
export default {
  name: "global-notification-snackbar",

  data() {
    return {
      isOpenLocal: false,
      textLocal: null,
      colorLocal: null,
      timeout: 4000,
    };
  },

  computed: {
    configs() {
      return this.$store.state.configuration.notificationSnackbar;
    },
  },
  watch: {
    configs(val) {
      const { text, color } = val;
      this.textLocal = text;
      this.colorLocal = color;
      this.isOpenLocal = true;
    },

    isOpenLocal(isOpen) {
      if (!isOpen)
        return this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: null,
          color: null,
        });
    },
  },
};
</script>
