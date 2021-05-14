<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Course Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetCoursesStart"
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
      <template v-slot:item.college="{ item }">
        <span class="text-capitalize">{{ item.college.name }}</span>
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
                label="Short Name"
                outlined
                v-model="form.shortName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="colleges"
                label="College"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.collegeId"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createCourse"
            :loading="isCreateCourseStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateCourse"
            :loading="isUpdateCourseStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete Course"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteCourseStart"
      :action="deleteCourse"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
} from "@/store/modules/course/course-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";
import { GET_COLLEGES } from "@/store/modules/college/college-types";

const defaultForm = {
  name: null,
  shortName: null,
  collegeId: null,
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
      isCreateCourseStart: false,
      isUpdateCourseStart: false,
      error: false,
      errorMessage: null,
      isGetCoursesStart: false,
      courses: [],
      search: null,
      selectedCourse: null,
      isDeleteAlertDialogOpen: false,
      isDeleteCourseStart: false,
      isGetCollegesStart: false,
      colleges: [],
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Course"
        : "Update Course";
    },

    isFormValid() {
      const { name, shortName, collegeId } = this.form;
      return name && shortName && collegeId;
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
          text: "College",
          value: "college",
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
      if (!this.search) return this.courses;
      return this.courses.filter((course) => {
        const { name, short_name, college } = course;
        const keyword = this.search.toLowerCase().trim();
        if (name.toLowerCase().trim().includes(keyword)) return course;
        if (short_name.toLowerCase().trim().includes(keyword)) return course;
        if (college.name.toLowerCase().trim().includes(keyword)) return course;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(course) {
      this.formDialogOperation = "update";
      this.selectedCourse = Object.assign({}, course);
      const { name, short_name, college } = course;
      this.form = Object.assign(this.form, {
        name,
        shortName: short_name,
        collegeId: college.id,
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

    openDeleteAlertDialog(course) {
      this.selectedCourse = Object.assign({}, course);
      this.isDeleteAlertDialogOpen = true;
    },

    async createCourse() {
      this.isCreateCourseStart = true;
      const payload = {
        name: this.form.name.trim() || null,
        shortName: this.form.shortName.trim() || null,
        collegeId: this.form.collegeId || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_COURSE,
        payload
      );
      if (!success) {
        this.isCreateCourseStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getCourses();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateCourseStart = false;
    },

    async updateCourse() {
      this.isUpdateCourseStart = true;
      const payload = {
        id: this.selectedCourse.id,
        name: this.form.name.trim() || null,
        shortName: this.form.shortName.trim() || null,
        collegeId: this.form.collegeId || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_COURSE,
        payload
      );
      if (!success) {
        this.isUpdateCourseStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getCourses();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateCourseStart = false;
    },

    async getCourses() {
      this.isGetCoursesStart = true;
      const { data } = await this.$store.dispatch(GET_COURSES);
      this.courses = data;
      this.isGetCoursesStart = false;
    },

    async getColleges() {
      this.isGetCollegesStart = true;
      const { data } = await this.$store.dispatch(GET_COLLEGES);
      this.colleges = data;
      this.isGetCollegesStart = false;
    },

    async deleteCourse() {
      this.isDeleteCourseStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_COURSE,
        this.selectedCourse.id
      );
      if (success) {
        await this.getCourses();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteCourseStart = false;
    },
  },

  async created() {
    await this.getCourses();
    await this.getColleges();
  },
};
</script>
