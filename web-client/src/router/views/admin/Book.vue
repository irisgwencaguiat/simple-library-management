<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Book Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetBooksStart"
      :items="tableItems"
      :headers="tableHeaders"
    >
      <template v-slot:top>
        <v-card-text>
          <v-text-field
            label="Search"
            outlined
            append-icon="mdi-magnify"
            v-model="search"
            autofocus
          ></v-text-field>
        </v-card-text>
      </template>
      <template v-slot:item.preview="{ item }">
        <v-avatar tile :size="30">
          <v-img :src="item.preview_url"></v-img>
        </v-avatar>
      </template>
      <template v-slot:item.category="{ item }">
        <span class="text-capitalize">{{ item.book_category.name }}</span>
      </template>
      <template v-slot:item.url="{ item }">
        <span
          class="blue--text text-decoration-underline"
          @click="openFile(item.url)"
          >Open file</span
        >
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ formatCreatedAt(item.created_at) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="openUpdateFormDialog(item)">
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon @click="openDeleteAlertDialog(item)">
          <v-icon> mdi-trash-can </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="isFormDialogOpen" width="500" persistent>
      <v-card>
        <v-card-title>
          <span>{{ formDialogTitle }}</span>
          <v-spacer> </v-spacer>
          <v-btn icon @click="closeFormDialog">
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
              <v-text-field
                label="Name"
                outlined
                v-model="form.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Description"
                outlined
                v-model="form.description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="bookCategories"
                label="Book Category"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.bookCategoryId"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="formDialogOperation === 'create'">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                label="Preview"
                outlined
                v-model="form.preview"
              ></v-file-input>
            </v-col>
            <v-col cols="12" v-if="formDialogOperation === 'update'">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                label="New Preview"
                outlined
                v-model="form.preview"
              ></v-file-input>
            </v-col>
            <v-col cols="12" v-if="formDialogOperation === 'create'">
              <v-file-input
                accept="application/pdf"
                prepend-icon=""
                prepend-inner-icon="mdi-file"
                label="File"
                outlined
                v-model="form.file"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createBook"
            :loading="isCreateBookStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateBook"
            :loading="isUpdateBookStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete Book"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteBookStart"
      :action="deleteBook"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_BOOK,
  DELETE_BOOK,
  GET_BOOKS,
  UPDATE_BOOK,
} from "@/store/modules/book/book-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";
import { GET_COLLEGES } from "@/store/modules/college/college-types";
import { GET_BOOK_CATEGORIES } from "@/store/modules/book-category/book-category-types";

const defaultForm = {
  name: null,
  description: null,
  bookCategoryId: null,
  file: null,
  preview: null,
};

export default {
  components: { CustomAlertDialog, CustomPasswordInput },

  mixins: [dateMixin],

  data() {
    return {
      isFormDialogOpen: false,
      form: Object.assign({}, defaultForm),
      defaultForm,
      formDialogOperation: null,
      isCreateBookStart: false,
      isUpdateBookStart: false,
      error: false,
      errorMessage: null,
      isGetBooksStart: false,
      books: [],
      search: null,
      selectedBook: null,
      isDeleteAlertDialogOpen: false,
      isDeleteBookStart: false,
      isGetBookCategoriesStart: false,
      bookCategories: [],
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Book"
        : "Update Book";
    },

    isFormValid() {
      const { name, description, bookCategoryId, file, preview } = this.form;
      const validations = {
        create: name && description && bookCategoryId && file && preview,
        update: name && description && bookCategoryId,
      };
      return validations[this.formDialogOperation];
    },

    tableHeaders() {
      return [
        {
          text: "Preview",
          value: "preview",
          sortable: false,
        },
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Category",
          value: "category",
          sortable: false,
        },
        {
          text: "URL",
          value: "url",
          sortable: false,
        },
        {
          text: "Created At",
          value: "created_at",
          sortable: false,
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "right",
        },
      ];
    },

    isFormDialogUpdateOperation() {
      return this.formDialogOperation === "update";
    },

    isFormDialogCreateOperation() {
      return this.formDialogOperation === "create";
    },

    tableItems() {
      if (!this.search) return this.books;
      return this.books.filter((book) => {
        const { name, description, book_category } = book;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return book;
        if (description.toLowerCase().trim().includes(keyword)) return book;
        if (book_category.name.toLowerCase().trim().includes(keyword))
          return book;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(book) {
      this.formDialogOperation = "update";
      this.selectedBook = Object.assign({}, book);
      const { name, description, book_category } = book;
      this.form = Object.assign(this.form, {
        name,
        description,
        bookCategoryId: book_category.id,
      });
      this.isFormDialogOpen = true;
    },

    closeFormDialog() {
      this.error = false;
      this.errorMessage = null;
      this.formDialogOperation = "create";
      this.form = Object.assign({}, this.defaultForm);
      this.isFormDialogOpen = false;
    },

    openDeleteAlertDialog(book) {
      this.selectedBook = Object.assign({}, book);
      this.isDeleteAlertDialogOpen = true;
    },

    async createBook() {
      this.isCreateBookStart = true;
      const payload = {
        name: this.form.name.trim() || null,
        description: this.form.description.trim() || null,
        bookCategoryId: this.form.bookCategoryId || null,
        file: this.form.file || null,
        preview: this.form.preview || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_BOOK,
        payload
      );
      if (!success) {
        this.isCreateBookStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getBooks();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateBookStart = false;
    },

    async updateBook() {
      this.isUpdateBookStart = true;
      const payload = {
        id: this.selectedBook.id,
        name: this.form.name.trim() || null,
        description: this.form.description.trim() || null,
        bookCategoryId: this.form.bookCategoryId || null,
        file: this.form.file || null,
        preview: this.form.preview || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_BOOK,
        payload
      );
      if (!success) {
        this.isUpdateBookStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getBooks();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateBookStart = false;
    },

    async getBooks() {
      this.isGetBooksStart = true;
      const { data } = await this.$store.dispatch(GET_BOOKS);
      this.books = data;
      this.isGetBooksStart = false;
    },

    async getBookCategories() {
      this.isGetBookCategoriesStart = true;
      const { data } = await this.$store.dispatch(GET_BOOK_CATEGORIES);
      this.bookCategories = data;
      this.isGetBookCategoriesStart = false;
    },

    async deleteBook() {
      this.isDeleteBookStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_BOOK,
        this.selectedBook.id
      );
      if (success) {
        await this.getBooks();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteBookStart = false;
    },

    openFile(url) {
      window.open(url);
    },
  },

  async created() {
    await this.getBooks();
    await this.getBookCategories();
  },
};
</script>
