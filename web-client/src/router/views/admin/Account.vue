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
          ></v-text-field>
        </v-card-text>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ formatCreatedAt(item.created_at) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon>
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon> mdi-trash-can </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="isFormDialogOpen" width="500" persistent>
      <v-card>
        <v-card-title>
          <span>{{ formDialogTitle }}</span>
          <v-spacer> </v-spacer>
          <v-btn icon @click="isFormDialogOpen = false">
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
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <custom-password-input
                label="Password"
                outlined
                :password.sync="form.password"
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
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_ACCOUNT,
  GET_ACCOUNTS,
} from "@/store/modules/account/account-types";
import dateMixin from "@/mixins/date-mixin";

const defaultForm = {
  firstName: null,
  lastName: null,
  username: null,
  password: null,
};

export default {
  components: { CustomPasswordInput },

  mixins: [dateMixin],

  data() {
    return {
      isFormDialogOpen: false,
      form: Object.assign({}, defaultForm),
      defaultForm,
      formDialogOperation: null,
      isCreateAccountStart: false,
      error: false,
      errorMessage: null,
      isGetAccountsStart: false,
      accounts: [],
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
      return firstName && lastName && username && password;
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

    tableItems() {
      return this.accounts;
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
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
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateAccountStart = false;
    },

    async getAccounts() {
      this.isGetAccountsStart = true;
      const { data } = await this.$store.dispatch(GET_ACCOUNTS, "admin");
      this.accounts = data;
      this.isGetAccountsStart = false;
    },
  },

  async created() {
    await this.getAccounts();
  },
};
</script>
