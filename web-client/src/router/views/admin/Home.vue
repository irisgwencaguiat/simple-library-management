<template>
  <section>
    <v-card-title
      ><span class="mr-1">Dashboard</span>
      <v-spacer></v-spacer>
      <v-chip color="primary" small :disabled="isGetTodayLoginStart">
        Today's Login:
        <span class="ml-1 font-weight-bold">{{ todayLogin }}</span>
      </v-chip>
    </v-card-title>
    <div class="mb-5"></div>
    <v-card outlined>
      <v-card-title>
        <v-chip color="primary" small :disabled="isGetBookViewsStart">
          Most Viewed Books
        </v-chip>
      </v-card-title>
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
import { AUTHENTICATION_GET_TODAY_LOGIN } from "@/store/modules/authentication/authentication-types";
import moment from "moment";
import { GET_BOOK_VIEW } from "@/store/modules/book/book-types";

export default {
  data() {
    return {
      isGetTodayLoginStart: false,
      todayLogin: 0,
      isGetBookViewsStart: false,
      bookViews: [],
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
  },

  methods: {
    async getTodayLogin() {
      this.isGetTodayLoginStart = true;
      const currentDay = moment().format("YYYY-MM-DD");
      const { data } = await this.$store.dispatch(
        AUTHENTICATION_GET_TODAY_LOGIN,
        currentDay
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
  },

  async created() {
    await this.getTodayLogin();
    await this.getBookViews();
  },
};
</script>
