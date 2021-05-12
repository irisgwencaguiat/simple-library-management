<template>
  <v-app :style="{ backgroundColor: '#f5f5f5' }">
    <v-app-bar app flat color="primary" dark clipped-left>
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
    <v-navigation-drawer app v-model="drawer" absolute clipped v-if="user">
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.first_name }} {{ user.last_name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-capitalize">{{
            user.account_type
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list rounded>
        <v-subheader>Navigations</v-subheader>
        <v-list-item-group color="primary" v-model="navigation">
          <template v-for="(navigation, index) in navigations">
            <v-list-item :key="index" :to="navigation.to" exact>
              <v-list-item-icon>
                <v-icon>
                  {{ navigation.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ navigation.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <global-notification-snackbar></global-notification-snackbar>
  </v-app>
</template>

<script>
import { PURGE_AUTHENTICATION_DETAILS } from "@/store/modules/authentication/authentication-types";
import GlobalNotificationSnackbar from "@/components/global/NotificationSnackbar";

export default {
  name: "dashboard-layout",
  components: { GlobalNotificationSnackbar },
  data() {
    return {
      drawer: true,
      navigation: 0,
    };
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },

    navigations() {
      const navigations = {
        admin: [
          {
            text: "Dashboard",
            to: { name: "dashboard-admin-home-view" },
            icon: "mdi-view-dashboard",
          },
          {
            text: "Admins",
            to: { name: "dashboard-admin-account-view" },
            icon: "mdi-account",
          },
          {
            text: "Colleges",
            to: { name: "dashboard-admin-college-view" },
            icon: "mdi-school",
          },
          {
            text: "Course",
            to: { name: "dashboard-admin-course-view" },
            icon: "mdi-book",
          },
        ],
      };
      return navigations[this.user.account_type];
    },
  },

  methods: {
    async logout() {
      this.$store.commit(PURGE_AUTHENTICATION_DETAILS);
      await this.$router.push({ name: "login-view" });
    },
  },
};
</script>
