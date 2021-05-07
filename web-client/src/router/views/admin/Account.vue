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
    <v-data-table>
      <template v-slot:top>
        <v-card-text>
          <v-text-field
            label="Search"
            outlined
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-card-text>
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
            <v-col cols="12" md="6">
              <v-text-field label="First Name" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Last Name" outlined></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Username" outlined></v-text-field>
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
          <v-btn color="primary" block>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";

const defaultForm = {
  password: null,
};

export default {
  components: { CustomPasswordInput },

  data() {
    return {
      isFormDialogOpen: false,
      form: Object.assign({}, defaultForm),
      formDialogOperation: null,
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Admin"
        : "Update Admin";
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },
  },
};
</script>
