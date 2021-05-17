<template>
  <section>
    <v-card-title
      ><span class="mr-1 display-1">Dashboard</span>
      <v-spacer></v-spacer>
      <v-chip color="primary" small :disabled="isGetTodayLoginStart">
        Today's Login:
        <span class="ml-1 font-weight-bold">{{ todayLogin }}</span>
      </v-chip>
    </v-card-title>
    <div class="mb-5"></div>
    <v-card outlined>
      <v-card-title> Course Logins </v-card-title>
      <v-data-table
        :items="courseLogins"
        :headers="courseLoginsTableHeaders"
        :loading="isGetCourseLoginsStart"
      >
        <template v-slot:item.course="{ item }">
          <span class="text-capitalize font-weight-bold">{{
            item.course.name
          }}</span>
        </template>
      </v-data-table>
    </v-card>
    <div class="mb-5"></div>
    <v-card outlined>
      <v-card-title> Most Viewed Books </v-card-title>
      <v-data-table
        :items="bookViews"
        :headers="bookViewsTableHeaders"
        :loading="isGetBookViewsStart"
      >
        <template v-slot:item.book="{ item }">
          <span class="text-capitalize font-weight-bold">{{ item.name }}</span>
        </template>
        <template v-slot:item.category="{ item }">
          <span class="text-capitalize">{{ item.book_category.name }}</span>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script>
import {
  AUTHENTICATION_GET_COURSE_LOGIN,
  AUTHENTICATION_GET_TODAY_LOGIN,
} from "@/store/modules/authentication/authentication-types";
import moment from "moment";
import { GET_BOOK_VIEW } from "@/store/modules/book/book-types";

export default {
  data() {
    return {
      isGetTodayLoginStart: false,
      todayLogin: 0,
      isGetBookViewsStart: false,
      bookViews: [],
      isGetCourseLoginsStart: false,
      courseLogins: [],
    };
  },

  computed: {
    bookViewsTableHeaders() {
      return [
        {
          text: "Book",
          value: "book",
          sortable: false,
        },

        {
          text: "Category",
          value: "category",
          sortable: false,
        },

        {
          text: "Views",
          value: "view",
          sortable: true,
        },
      ];
    },

    courseLoginsTableHeaders() {
      return [
        {
          text: "Course",
          value: "course",
          sortable: false,
        },

        {
          text: "# of Logins",
          value: "login_count",
          sortable: true,
        },
      ];
    },

    currentDate() {
      return moment().format("YYYY-MM-DD");
    },
  },

  methods: {
    async getTodayLogin() {
      this.isGetTodayLoginStart = true;
      const { data } = await this.$store.dispatch(
        AUTHENTICATION_GET_TODAY_LOGIN,
        this.currentDate
      );
      this.todayLogin = data.login_count || 0;
      this.isGetTodayLoginStart = false;
    },

    async getBookViews() {
      this.isGetBookViewsStart = true;
      const { data } = await this.$store.dispatch(GET_BOOK_VIEW);
      this.bookViews = data;
      this.isGetBookViewsStart = false;
    },

    async getCourseLogins() {
      this.isGetCourseLoginsStart = true;
      const { data } = await this.$store.dispatch(
        AUTHENTICATION_GET_COURSE_LOGIN,
        this.currentDate
      );
      this.courseLogins = data;
      this.isGetCourseLoginsStart = false;
    },
  },

  async created() {
    await this.getTodayLogin();
    await this.getBookViews();
    await this.getCourseLogins();
  },
};
</script>
