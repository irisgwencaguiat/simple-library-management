<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> College Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetCollegesStart"
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
          <v-btn icon @click="closeUpdateFormDialog">
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
                label="Short Name"
                outlined
                v-model="form.shortName"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createCollege"
            :loading="isCreateCollegeStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateCollege"
            :loading="isUpdateCollegeStart"
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
      :loading="isDeleteCollegeStart"
      :action="deleteCollege"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_COLLEGE,
  DELETE_COLLEGE,
  GET_COLLEGES,
  UPDATE_COLLEGE,
} from "@/store/modules/college/college-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";

const defaultForm = {
  name: null,
  shortName: null,
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
      isCreateCollegeStart: false,
      isUpdateCollegeStart: false,
      error: false,
      errorMessage: null,
      isGetCollegesStart: false,
      colleges: [],
      search: null,
      selectedCollege: null,
      isDeleteAlertDialogOpen: false,
      isDeleteCollegeStart: false,
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create College"
        : "Update College";
    },

    isFormValid() {
      const { name, shortName } = this.form;
      return name && shortName;
    },

    tableHeaders() {
      return [
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Short Name",
          value: "short_name",
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
      if (!this.search) return this.colleges;
      return this.colleges.filter((college) => {
        const { name, short_name } = college;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return college;
        if (short_name.toLowerCase().trim().includes(keyword)) return college;
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
      this.selectedCollege = Object.assign({}, college);
      const { name, short_name } = college;
      this.form = Object.assign(this.form, {
        name,
        shortName: short_name,
      });
      this.isFormDialogOpen = true;
    },

    closeUpdateFormDialog() {
      this.error = false;
      this.errorMessage = null;
      this.formDialogOperation = "create";
      this.form = Object.assign({}, this.defaultForm);
      this.isFormDialogOpen = false;
    },

    openDeleteAlertDialog(college) {
      this.selectedCollege = Object.assign({}, college);
      this.isDeleteAlertDialogOpen = true;
    },

    async createCollege() {
      this.isCreateCollegeStart = true;
      const payload = {
        name: this.form.name.trim() || null,
        shortName: this.form.shortName.trim() || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_COLLEGE,
        payload
      );
      if (!success) {
        this.isCreateCollegeStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getColleges();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateCollegeStart = false;
    },

    async updateCollege() {
      this.isUpdateCollegeStart = true;
      const payload = {
        id: this.selectedCollege.id,
        name: this.form.name.trim() || null,
        shortName: this.form.shortName.trim() || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_COLLEGE,
        payload
      );
      if (!success) {
        this.isUpdateCollegeStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getColleges();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateCollegeStart = false;
    },

    async getColleges() {
      this.isGetCollegesStart = true;
      const { data } = await this.$store.dispatch(GET_COLLEGES);
      this.colleges = data;
      this.isGetCollegesStart = false;
    },

    async deleteCollege() {
      this.isDeleteCollegeStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_COLLEGE,
        this.selectedCollege.id
      );
      if (success) {
        await this.getColleges();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteCollegeStart = false;
    },
  },

  async created() {
    await this.getColleges();
  },
};
</script>
