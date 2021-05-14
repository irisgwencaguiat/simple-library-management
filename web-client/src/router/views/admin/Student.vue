<template>
  <v-card outlined>
    <v-card-title>
      <span class="font-weight-bold"> Student Management </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="openCreateFormDialog"
        >Create <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-title>
    <v-data-table
      :loading="isGetStudentsStart"
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
        <span class="text-capitalize"
          >{{ item.account.first_name }} {{ item.account.last_name }}</span
        >
      </template>
      <template v-slot:item.college="{ item }">
        <span class="text-capitalize">{{ item.college.name }}</span>
      </template>
      <template v-slot:item.course="{ item }">
        <span class="text-capitalize">{{ item.course.name }}</span>
      </template>
      <template v-slot:item.section="{ item }">
        <span class="text-capitalize">{{ item.section.name }}</span>
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
    <v-dialog v-model="isFormDialogOpen" width="800" persistent>
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
                label="Student Number"
                outlined
                v-model="form.studentNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                :items="colleges"
                label="College"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.collegeId"
                @change="clearCourseAndSection"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                :items="courseValues"
                label="Course"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.courseId"
                :disabled="!form.collegeId"
                @change="clearSection"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                :items="sectionValues"
                label="Section"
                outlined
                item-text="name"
                item-value="id"
                v-model="form.sectionId"
                :disabled="!form.courseId"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="createStudent"
            :loading="isCreateStudentStart"
            :disabled="!isFormValid"
            v-if="isFormDialogCreateOperation"
            >Create</v-btn
          >
          <v-btn
            color="primary"
            block
            @click="updateStudent"
            :loading="isUpdateStudentStart"
            :disabled="!isFormValid"
            v-if="isFormDialogUpdateOperation"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <custom-alert-dialog
      :is-open.sync="isDeleteAlertDialogOpen"
      title="Delete Student"
      type="error"
      text="This actions is irreversible, click confirm if you are sure."
      :loading="isDeleteStudentStart"
      :action="deleteStudent"
    ></custom-alert-dialog>
  </v-card>
</template>

<script>
import CustomPasswordInput from "@/components/custom/PasswordInput";
import {
  CREATE_STUDENT,
  DELETE_STUDENT,
  GET_STUDENTS,
  UPDATE_STUDENT,
} from "@/store/modules/student/student-types";
import dateMixin from "@/mixins/date-mixin";
import { SET_NOTIFICATION_SNACKBAR_CONFIGURATION } from "@/store/modules/configuration/configuration-types";
import CustomAlertDialog from "@/components/custom/AlertDialog";
import { GET_COURSES } from "@/store/modules/course/course-types";
import { GET_COLLEGES } from "@/store/modules/college/college-types";
import { GET_SECTIONS } from "@/store/modules/section/section-types";

const defaultForm = {
  firstName: null,
  lastName: null,
  studentNumber: null,
  collegeId: null,
  courseId: null,
  sectionId: null,
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
      isCreateStudentStart: false,
      isUpdateStudentStart: false,
      error: false,
      errorMessage: null,
      isGetStudentsStart: false,
      students: [],
      search: null,
      selectedStudent: null,
      isDeleteAlertDialogOpen: false,
      isDeleteStudentStart: false,
      isGetCollegesStart: false,
      colleges: [],
      isGetCoursesStart: false,
      courses: [],
      isGetSectionsStart: false,
      sections: [],
    };
  },

  computed: {
    formDialogTitle() {
      return this.formDialogOperation && this.formDialogOperation === "create"
        ? "Create Student"
        : "Update Student";
    },

    isFormValid() {
      const {
        firstName,
        lastName,
        studentNumber,
        collegeId,
        courseId,
        sectionId,
      } = this.form;
      return (
        firstName &&
        lastName &&
        studentNumber &&
        collegeId &&
        courseId &&
        sectionId
      );
    },

    courseValues() {
      const { collegeId } = this.form;
      if (!collegeId) return [];
      return this.courses.filter((course) => course.college.id === collegeId);
    },

    sectionValues() {
      const { courseId } = this.form;
      if (!courseId) return [];
      return this.sections.filter((section) => section.course.id === courseId);
    },

    tableHeaders() {
      return [
        {
          text: "Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Student Number",
          value: "student_number",
          sortable: false,
        },
        {
          text: "College",
          value: "college",
          sortable: false,
        },
        {
          text: "Course",
          value: "course",
          sortable: false,
        },
        {
          text: "Section",
          value: "section",
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
      if (!this.search) return this.students;
      return this.students.filter((student) => {
        const { account, student_number, college, course, section } = student;
        const keyword = this.search.toLowerCase().trim();
        if (account.first_name.toLowerCase().trim().includes(keyword))
          return student;
        if (account.last_name.toLowerCase().trim().includes(keyword))
          return student;
        if (student_number.toLowerCase().trim().includes(keyword))
          return student;
        if (college.name.toLowerCase().trim().includes(keyword)) return student;
        if (course.name.toLowerCase().trim().includes(keyword)) return student;
        if (section.name.toLowerCase().trim().includes(keyword)) return student;
      });
    },
  },

  methods: {
    openCreateFormDialog() {
      this.formDialogOperation = "create";
      this.isFormDialogOpen = true;
    },

    openUpdateFormDialog(student) {
      this.formDialogOperation = "update";
      const { account, student_number, college, course, section } = student;
      this.selectedStudent = Object.assign({}, student);
      this.form = Object.assign(this.form, {
        firstName: account.first_name,
        lastName: account.last_name,
        studentNumber: student_number,
        collegeId: college.id,
        courseId: course.id,
        sectionId: section.id,
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

    openDeleteAlertDialog(student) {
      this.selectedStudent = Object.assign({}, student);
      this.isDeleteAlertDialogOpen = true;
    },

    async createStudent() {
      this.isCreateStudentStart = true;
      const payload = {
        firstName: this.form.firstName.trim() || null,
        lastName: this.form.lastName.trim() || null,
        studentNumber: this.form.studentNumber.trim() || null,
        collegeId: this.form.collegeId || null,
        courseId: this.form.courseId || null,
        sectionId: this.form.sectionId || null,
      };
      const { success, message } = await this.$store.dispatch(
        CREATE_STUDENT,
        payload
      );
      if (!success) {
        this.isCreateStudentStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getStudents();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isCreateStudentStart = false;
    },

    async updateStudent() {
      this.isUpdateStudentStart = true;
      const payload = {
        id: this.selectedStudent.id,
        firstName: this.form.firstName.trim() || null,
        lastName: this.form.lastName.trim() || null,
        studentNumber: this.form.studentNumber.trim() || null,
        collegeId: this.form.collegeId || null,
        courseId: this.form.courseId || null,
        sectionId: this.form.sectionId || null,
      };
      const { success, message } = await this.$store.dispatch(
        UPDATE_STUDENT,
        payload
      );
      if (!success) {
        this.isUpdateStudentStart = false;
        this.error = true;
        this.errorMessage = message;
        return;
      }
      await this.getStudents();
      this.isFormDialogOpen = false;
      this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
        text: message,
        color: "success",
      });
      this.form = Object.assign({}, this.defaultForm);
      this.error = false;
      this.errorMessage = null;
      this.isUpdateStudentStart = false;
    },

    async getStudents() {
      this.isGetStudentsStart = true;
      const { data } = await this.$store.dispatch(GET_STUDENTS);
      this.students = data;
      this.isGetStudentsStart = false;
    },

    async getColleges() {
      this.isGetCollegesStart = true;
      const { data } = await this.$store.dispatch(GET_COLLEGES);
      this.colleges = data;
      this.isGetCollegesStart = false;
    },

    async getCourses() {
      this.isGetCoursesStart = true;
      const { data } = await this.$store.dispatch(GET_COURSES);
      this.courses = data;
      this.isGetCoursesStart = false;
    },

    async getSections() {
      this.isGetSectionsStart = true;
      const { data } = await this.$store.dispatch(GET_SECTIONS);
      this.sections = data;
      this.isGetSectionsStart = false;
    },

    async deleteStudent() {
      this.isDeleteStudentStart = true;
      const { success, message } = await this.$store.dispatch(
        DELETE_STUDENT,
        this.selectedStudent.id
      );
      if (success) {
        await this.getStudents();
        this.isDeleteAlertDialogOpen = false;
        this.$store.commit(SET_NOTIFICATION_SNACKBAR_CONFIGURATION, {
          text: message,
          color: "error",
        });
      }
      this.isDeleteStudentStart = false;
    },

    clearCourseAndSection() {
      const { collegeId, courseId, sectionId } = this.form;
      if (collegeId && (courseId || sectionId)) {
        this.form.courseId = null;
        this.form.sectionId = null;
      }
    },

    clearSection() {
      const { collegeId, sectionId } = this.form;
      if (collegeId && sectionId) {
        this.form.sectionId = null;
      }
    },
  },

  async created() {
    await this.getStudents();
    await this.getColleges();
    await this.getCourses();
    await this.getSections();
  },
};
</script>
