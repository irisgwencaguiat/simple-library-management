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
        <v-list-item-action>
          <v-btn icon @click="isAccountFormDialogOpen = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-action>
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
    <v-dialog v-model="isAccountFormDialogOpen" width="500" persistent>
      <v-card>
        <v-card-title>
          <span> Account Information </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="isAccountFormDialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" v-if="error">
              <v-alert type="error">
                {{ errorMessage }}
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-row dense>
                <v-col cols="12">
                  <span class="subtitle-2">Basic Information</span>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="First Name"
                    readonly
                    outlined
                    :value="user.first_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Last Name"
                    readonly
                    outlined
                    :value="user.last_name"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row dense>
                <v-col cols="12">
                  <span class="subtitle-2">Credentials</span>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Username"
                    readonly
                    outlined
                    :value="user.username"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <custom-password-input
                    label="Old Password"
                    outlined
                    :password.sync="form.oldPassword"
                  ></custom-password-input>
                </v-col>
                <v-col cols="12">
                  <custom-password-input
                    label="New Password"
                    outlined
                    :password.sync="form.newPassword"
                  ></custom-password-input>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            :loading="isChangePasswordStart"
            @click="changePassword"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { PURGE_AUTHENTICATION_DETAILS } from "@/store/modules/authentication/authentication-types";
import GlobalNotificationSnackbar from "@/components/global/NotificationSnackbar";
import CustomPasswordInput from "@/components/custom/PasswordInput";
import { CHANGE_ACCOUNT_PASSWORD } from "@/store/modules/account/account-types";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";

const defaultForm = {
  oldPassword: null,
  newPassword: null,
};

export default {
  name: "dashboard-layout",

  components: { CustomPasswordInput, GlobalNotificationSnackbar },

  data() {
    return {
      drawer: true,
      navigation: 0,
      form: Object.assign({}, defaultForm),
      defaultForm,
      isAccountFormDialogOpen: false,
      error: false,
      errorMessage: null,
      isChangePasswordStart: false,
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
            text: "Students",
            to: { name: "dashboard-admin-student-view" },
            icon: "mdi-account",
          },
          {
            text: "Admins",
            to: { name: "dashboard-admin-account-view" },
            icon: "mdi-shield-account",
          },
          {
            text: "Book Categories",
            to: { name: "dashboard-admin-book-category-view" },
            icon: "mdi-book-variant-multiple",
          },
          {
            text: "Books",
            to: { name: "dashboard-admin-book-view" },
            icon: "mdi-bookshelf",
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
          {
            text: "Section",
            to: { name: "dashboard-admin-section-view" },
            icon: "mdi-google-classroom",
          },
        ],
      };
      return navigations[this.user.account_type];
    },

    isFormValid() {
      const { oldPassword, newPassword } = this.form;
      return oldPassword && newPassword;
    },
  },

  methods: {
    async logout() {
      this.$store.commit(PURGE_AUTHENTICATION_DETAILS);
      await this.$router.push({ name: "login-view" });
    },

    async changePassword() {
      const payload = {
        oldPassword: this.form.oldPassword || null,
        newPassword: this.form.newPassword || null,
      };
      this.isChangePasswordStart = true;
      const { success, message } = await this.$store.dispatch(
        CHANGE_ACCOUNT_PASSWORD,
        payload
      );
      if (!success) {
        this.isChangePasswordStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      this.error = false;
      this.errorMessage = null;
      this.isChangePasswordStart = false;
      this.isAccountFormDialogOpen = false;
      this.form = Object.assign({}, this.defaultForm);
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: "Password changed successfully.",
        color: "success",
      });
    },
  },
};
</script>
