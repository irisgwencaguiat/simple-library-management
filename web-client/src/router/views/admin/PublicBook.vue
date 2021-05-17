<template>
  <v-card outlined>
    <v-card-title>Books</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            outlined
            label="Search"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <div class="d-flex justify-space-around align-center">
            <v-chip
              color="primary"
              @click="selectedBookCategory = 'All'"
              :outlined="!isBookCategoryActive('All')"
              >All</v-chip
            >
            <template v-for="(category, index) in bookCategories">
              <v-chip
                color="primary"
                :key="index"
                @click="selectedBookCategory = category.name"
                :outlined="!isBookCategoryActive(category.name)"
                >{{ category.name }}</v-chip
              >
            </template>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" v-if="isGetBookCategoriesStart || isGetBooksStart">
          <div class="text-center">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-col>
        <v-col cols="12" v-else>
          <v-row dense>
            <template v-for="(book, index) in displayedBooks">
              <v-col cols="12" md="3" :key="index">
                <public-book-item :book="book"></public-book-item>
              </v-col>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { GET_BOOK_CATEGORIES } from "@/store/modules/book-category/book-category-types";
import { GET_BOOKS } from "@/store/modules/book/book-types";
import PublicBookItem from "@/router/views/admin/PublicBookItem";

export default {
  components: { PublicBookItem },
  data() {
    return {
      bookCategories: [],
      isGetBookCategoriesStart: false,
      selectedBookCategory: "All",
      isGetBooksStart: false,
      books: [],
    };
  },

  computed: {
    displayedBooks() {
      return this.books;
    },
  },

  methods: {
    async getBookCategories() {
      this.isGetBookCategoriesStart = true;
      const { data } = await this.$store.dispatch(GET_BOOK_CATEGORIES);
      this.bookCategories = data;
      this.isGetBookCategoriesStart = false;
    },

    async getBooks() {
      this.isGetBooksStart = true;
      const { data } = await this.$store.dispatch(GET_BOOKS);
      this.books = data;
      this.isGetBooksStart = false;
    },

    isBookCategoryActive(slug) {
      return slug === this.selectedBookCategory;
    },
  },

  async created() {
    await this.getBookCategories();
    await this.getBooks();
  },
};
</script>
