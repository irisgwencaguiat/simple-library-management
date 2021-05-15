<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Book Category Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetBookCategoriesStart"
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
              <v-text-field
                label="Description"
                outlined
                v-model="form.description"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createBookCategory"
            :loading="isCreateBookCategoryStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateBookCategory"
            :loading="isUpdateBookCategoryStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete College"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteBookCategoryStart"
      :action="deleteBookCategory"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";
import {
  CREATE_BOOK_CATEGORY,
  DELETE_BOOK_CATEGORY,
  GET_BOOK_CATEGORIES,
  UPDATE_BOOK_CATEGORY,
} from "@/store/modules/book-category/book-category-types";

const defaultForm = {
  name: null,
  description: null,
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
      isCreateBookCategoryStart: false,
      isUpdateBookCategoryStart: false,
      error: false,
      errorMessage: null,
      isGetBookCategoriesStart: false,
      bookCategories: [],
      search: null,
      selectedBookCategory: null,
      isDeleteAlertDialogOpen: false,
      isDeleteBookCategoryStart: false,
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Book Category"
        : "Update Book Category";
    },

    isFormValid() {
      const { name, description } = this.form;
      return name && description;
    },

    tableHeaders() {
      return [
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Description",
          value: "description",
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
      if (!this.search) return this.bookCategories;
      return this.bookCategories.filter((college) => {
        const { name, description } = college;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return college;
        if (description.toLowerCase().trim().includes(keyword)) return college;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(college) {
      this.formDialogOperation = "update";
      this.selectedBookCategory = Object.assign({}, college);
      const { name, description } = college;
      this.form = Object.assign(this.form, {
        name,
        description,
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

    openDeleteAlertDialog(college) {
      this.selectedBookCategory = Object.assign({}, college);
      this.isDeleteAlertDialogOpen = true;
    },

    async createBookCategory() {
      this.isCreateBookCategoryStart = true;
      const payload = {
        name: this.form.name.trim() || null,
        description: this.form.description.trim() || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_BOOK_CATEGORY,
        payload
      );
      if (!success) {
        this.isCreateBookCategoryStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getBookCategories();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateBookCategoryStart = false;
    },

    async updateBookCategory() {
      this.isUpdateBookCategoryStart = true;
      const payload = {
        id: this.selectedBookCategory.id,
        name: this.form.name.trim() || null,
        description: this.form.description.trim() || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_BOOK_CATEGORY,
        payload
      );
      if (!success) {
        this.isUpdateBookCategoryStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getBookCategories();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateBookCategoryStart = false;
    },

    async getBookCategories() {
      this.isGetBookCategoriesStart = true;
      const { data } = await this.$store.dispatch(GET_BOOK_CATEGORIES);
      this.bookCategories = data;
      this.isGetBookCategoriesStart = false;
    },

    async deleteBookCategory() {
      this.isDeleteBookCategoryStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_BOOK_CATEGORY,
        this.selectedBookCategory.id
      );
      if (success) {
        await this.getBookCategories();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteBookCategoryStart = false;
    },
  },

  async created() {
    await this.getBookCategories();
  },
};
</script>
