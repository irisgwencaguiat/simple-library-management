<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Section Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetSectionsStart"
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
      <template v-slot:item.course="{ item }">
        <span class="text-capitalize">{{ item.course.name }}</span>
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
              <v-autocomplete
                :items="courses"
                label="Course"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.courseId"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createSection"
            :loading="isCreateSectionStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateSection"
            :loading="isUpdateSectionStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete Section"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteSectionStart"
      :action="deleteSection"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_SECTION,
  DELETE_SECTION,
  GET_SECTIONS,
  UPDATE_SECTION,
} from "@/store/modules/section/section-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";
import { GET_COURSES } from "@/store/modules/course/course-types";

const defaultForm = {
  name: null,
  courseId: null,
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
      isCreateSectionStart: false,
      isUpdateSectionStart: false,
      error: false,
      errorMessage: null,
      isGetSectionsStart: false,
      sections: [],
      search: null,
      selectedSection: null,
      isDeleteAlertDialogOpen: false,
      isDeleteSectionStart: false,
      isGetCoursesStart: false,
      courses: [],
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Section"
        : "Update Section";
    },

    isFormValid() {
      const { name, courseId } = this.form;
      return name && courseId;
    },

    tableHeaders() {
      return [
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Course",
          value: "course",
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
      if (!this.search) return this.sections;
      return this.sections.filter((section) => {
        const { name, course } = section;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return section;
        if (course.name.toLowerCase().trim().includes(keyword)) return section;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(section) {
      this.formDialogOperation = "update";
      this.selectedSection = Object.assign({}, section);
      const { name, course } = section;
      this.form = Object.assign(this.form, {
        name,
        courseId: course.id,
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

    openDeleteAlertDialog(section) {
      this.selectedSection = Object.assign({}, section);
      this.isDeleteAlertDialogOpen = true;
    },

    async createSection() {
      this.isCreateSectionStart = true;
      const payload = {
        name: this.form.name.trim() || null,
        courseId: this.form.courseId || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_SECTION,
        payload
      );
      if (!success) {
        this.isCreateSectionStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getSections();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateSectionStart = false;
    },

    async updateSection() {
      this.isUpdateSectionStart = true;
      const payload = {
        id: this.selectedSection.id,
        name: this.form.name.trim() || null,
        courseId: this.form.courseId || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_SECTION,
        payload
      );
      if (!success) {
        this.isUpdateSectionStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getSections();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateSectionStart = false;
    },

    async getSections() {
      this.isGetSectionsStart = true;
      const { data } = await this.$store.dispatch(GET_SECTIONS);
      this.sections = data;
      this.isGetSectionsStart = false;
    },

    async getCourses() {
      this.isGetCoursesStart = true;
      const { data } = await this.$store.dispatch(GET_COURSES);
      this.courses = data;
      this.isGetCoursesStart = false;
    },

    async deleteSection() {
      this.isDeleteSectionStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_SECTION,
        this.selectedSection.id
      );
      if (success) {
        await this.getSections();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteSectionStart = false;
    },
  },

  async created() {
    await this.getSections();
    await this.getCourses();
  },
};
</script>
