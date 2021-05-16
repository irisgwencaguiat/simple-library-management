<template>
  <v-card outlined :loading="isGetTodayLoginStart">
    <v-card-title
      ><span class="mr-1">Dashboard</span>
      <v-chip color="primary" small :disabled="isGetTodayLoginStart">
        Today's Login:
        <span class="ml-1 font-weight-bold">{{ todayLogin }}</span>
      </v-chip>
    </v-card-title>
    <v-card-subtitle> </v-card-subtitle>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card-subtitle>Most Viewed Books</v-card-subtitle>
        <v-data-table></v-data-table>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-subtitle>Login by Course</v-card-subtitle>
        <v-data-table></v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { AUTHENTICATION_GET_TODAY_LOGIN } from "@/store/modules/authentication/authentication-types";
import moment from "moment";

export default {
  data() {
    return {
      isGetTodayLoginStart: false,
      todayLogin: 0,
    };
  },

  methods: {
    async getTodayLogin() {
      this.isGetTodayLoginStart = true;
      const currentDay = moment().format("YYYY-MM-DD");
      console.log(currentDay);
      const { data } = await this.$store.dispatch(
        AUTHENTICATION_GET_TODAY_LOGIN,
        currentDay
      );
      this.todayLogin = data.login_count || 0;
      this.isGetTodayLoginStart = false;
    },
  },

  async created() {
    await this.getTodayLogin();
  },
};
</script>
