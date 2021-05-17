<template>
  <v-card outlined height="380">
    <v-img height="200" :src="book.preview_url" position="center"></v-img>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="title">{{ book.name }}</v-list-item-title>
        <v-list-item-subtitle class="subtitle-2">{{
          book.book_category.name
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-text class="text-truncate">
      <span :title="book.description">
        {{ book.description }}
      </span>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn outlined color="primary" @click="openFile(book.url)">Read</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { BOOK_VIEW } from "@/store/modules/book/book-types";

export default {
  name: "public-book-item",

  props: {
    book: {
      type: Object,
      required: true,
    },
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
  },

  methods: {
    openFile(url) {
      window.open(url);
    },
  },

  async mounted() {
    const payload = {
      bookId: this.book.id,
      accountId: this.user.id,
    };
    await this.$store.dispatch(BOOK_VIEW, payload);
  },
};
</script>
