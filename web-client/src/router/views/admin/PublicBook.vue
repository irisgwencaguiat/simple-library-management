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
            v-model="search"
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
      search: null,
    };
  },

  computed: {
    displayedBooks() {
      if (!this.search && this.selectedBookCategory === "All")
        return this.books;
      const searchFunction = (book) => {
        const { name, description, book_category } = book;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return book;
        if (description.toLowerCase().trim().includes(keyword)) return book;
        if (book_category.name.toLowerCase().trim().includes(keyword))
          return book;
      };
      const filterFunction = (book) =>
        book.book_category.name === this.selectedBookCategory;
      if (this.search && this.selectedBookCategory === "All")
        return this.books.filter(searchFunction);
      if (!this.search && this.selectedBookCategory !== "All")
        return this.books.filter(filterFunction);
      return this.books.filter(filterFunction).filter(searchFunction);
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
