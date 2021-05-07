<template>
  <v-app :style="{ backgroundColor: '#f5f5f5' }">
    <v-app-bar app flat color="primary" dark>
      <v-container>
        <v-toolbar-title>
          <v-avatar :size="40">
            <v-img :src="require('@/assets/udm-logo.png')"></v-img>
          </v-avatar>
          <span class="font-weight-bold ml-3">UDM</span>
        </v-toolbar-title>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row justify="center" align="center" align-content="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card>
              <v-card-title class="font-weight-bold"
                >UDM Library System</v-card-title
              >
              <v-card-subtitle>Welcome, please log in.</v-card-subtitle>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" v-if="error">
                    <v-alert type="error">
                      {{ errorMessage }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      placeholder="Username"
                      prepend-inner-icon="mdi-account"
                      v-model="form.username"
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <custom-password-input
                      outlined
                      placeholder="Password"
                      :password.sync="form.password"
                      prepend-inner-icon="mdi-lock"
                      :action="login"
                    ></custom-password-input>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                  depressed
                  large
                  :disabled="!isFormValid"
                  :loading="isLoginStart"
                  @click="login"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { AUTHENTICATION_LOGIN } from "@/store/modules/authentication/authentication-types";
import CustomPasswordInput from "@/components/custom/PasswordInput";

const defaultForm = {
  username: null,
  password: null,
};

export default {
  components: { CustomPasswordInput },
  data() {
    return {
      form: Object.assign({}, defaultForm),
      isLoginStart: false,
      error: false,
      errorMessage: null,
    };
  },

  computed: {
    isFormValid() {
      const { username, password } = this.form;
      return username && password;
    },
  },

  methods: {
    async login() {
      const payload = {
        username: this.form.username || null,
        password: this.form.password || null,
      };
      this.isLoginStart = true;
      const { success, message } = await this.$store.dispatch(
        AUTHENTICATION_LOGIN,
        payload
      );
      if (!success) {
        this.isLoginStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      this.error = false;
      this.errorMessage = null;
      this.isLoginStart = false;
      await this.$router.push({ name: "dashboard-admin-home-view" });
    },
  },
};
</script>
