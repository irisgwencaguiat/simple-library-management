import Vue from "vue";
import Vuex from "vuex";
import authenticationStore from "@/store/modules/authentication/authentication-store";
import accountStore from "@/store/modules/account/account-store";
import configurationStore from "@/store/modules/configuration/configuration-store";
import collegeStore from "@/store/modules/college/college-store";
import courseStore from "@/store/modules/course/course-store";
import sectionStore from "@/store/modules/section/section-store";
import studentStore from "@/store/modules/student/student-store";
import bookCategoryStore from "@/store/modules/book-category/book-category-store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication: authenticationStore,
    account: accountStore,
    configuration: configurationStore,
    college: collegeStore,
    course: courseStore,
    section: sectionStore,
    student: studentStore,
    bookCategory: bookCategoryStore,
  },
});
