<template>
  <v-app>
    <v-app-bar app flat color="primary" dark>
      <v-container>
        <v-row justify="space-between" align-content="center" align="center">
          <v-toolbar-title>
            <v-avatar :size="40">
              <v-img :src="require('@/assets/udm-logo.png')"></v-img>
            </v-avatar>
            <span class="font-weight-bold ml-3">UDM</span>
          </v-toolbar-title>
          <v-btn icon @click="logout">
            <v-icon> mdi-logout </v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { PURGE_AUTHENTICATION_DETAILS } from "@/store/modules/authentication/authentication-types";

export default {
  name: "dashboard-layout",

  methods: {
    async logout() {
      this.$store.commit(PURGE_AUTHENTICATION_DETAILS);
      await this.$router.push({ name: "login-view" });
    },
  },
};
</script>
