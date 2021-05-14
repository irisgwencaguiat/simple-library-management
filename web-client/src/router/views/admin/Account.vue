<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Admin Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetAccountsStart"
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
      <template v-slot:item.name="{ item }">
        <span class="text-capitalize">
          {{ item.first_name }} {{ item.last_name }}
        </span>
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
            <v-col cols="12" md="6">
              <v-text-field
                label="First Name"
                outlined
                v-model="form.firstName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Last Name"
                outlined
                v-model="form.lastName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Username"
                outlined
                v-model="form.username"
                :readonly="isFormDialogUpdateOperation"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <custom-password-input
                label="Password"
                outlined
                :password.sync="form.password"
                :action="createAccount"
                v-if="isFormDialogCreateOperation"
              ></custom-password-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createAccount"
            :loading="isCreateAccountStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateAccount"
            :loading="isUpdateAccountStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete Admin"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteAdminStart"
      :action="deleteAdmin"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  UPDATE_ACCOUNT,
} from "@/store/modules/account/account-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";

const defaultForm = {
  firstName: null,
  lastName: null,
  username: null,
  password: null,
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
      isCreateAccountStart: false,
      isUpdateAccountStart: false,
      error: false,
      errorMessage: null,
      isGetAccountsStart: false,
      accounts: [],
      search: null,
      selectedAccount: null,
      isDeleteAlertDialogOpen: false,
      isDeleteAdminStart: false,
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Admin"
        : "Update Admin";
    },

    isFormValid() {
      const { firstName, lastName, username, password } = this.form;
      const conditions = {
        create: firstName && lastName && username && password,
        update: firstName && lastName,
      };
      return conditions[this.formDialogOperation];
    },

    tableHeaders() {
      return [
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Username",
          value: "username",
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
      if (!this.search) return this.accounts;
      return this.accounts.filter((account) => {
        const { first_name, last_name, username } = account;
        const keyword = this.search.toLowerCase().trim();
        if (first_name.toLowerCase().trim().includes(keyword)) return account;
        if (last_name.toLowerCase().trim().includes(keyword)) return account;
        if (username.toLowerCase().trim().includes(keyword)) return account;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(account) {
      this.formDialogOperation = "update";
      this.selectedAccount = Object.assign({}, account);
      const { first_name, last_name, username } = account;
      this.form = Object.assign(this.form, {
        firstName: first_name,
        lastName: last_name,
        username,
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

    openDeleteAlertDialog(account) {
      this.selectedAccount = Object.assign({}, account);
      this.isDeleteAlertDialogOpen = true;
    },

    async createAccount() {
      this.isCreateAccountStart = true;
      const payload = {
        firstName: this.form.firstName.trim() || null,
        lastName: this.form.lastName.trim() || null,
        type: "admin",
        username: this.form.username.trim() || null,
        password: this.form.password || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_ACCOUNT,
        payload
      );
      if (!success) {
        this.isCreateAccountStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getAccounts();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateAccountStart = false;
    },

    async updateAccount() {
      this.isUpdateAccountStart = true;
      const payload = {
        id: this.selectedAccount.id,
        firstName: this.form.firstName.trim() || null,
        lastName: this.form.lastName.trim() || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_ACCOUNT,
        payload
      );
      if (!success) {
        this.isUpdateAccountStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getAccounts();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateAccountStart = false;
    },

    async getAccounts() {
      this.isGetAccountsStart = true;
      const { data } = await this.$store.dispatch(GET_ACCOUNTS, "admin");
      this.accounts = data;
      this.isGetAccountsStart = false;
    },

    async deleteAdmin() {
      this.isDeleteAdminStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_ACCOUNT,
        this.selectedAccount.id
      );
      if (success) {
        await this.getAccounts();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteAdminStart = false;
    },
  },

  async created() {
    await this.getAccounts();
  },
};
</script>
