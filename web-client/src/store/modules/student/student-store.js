import apiService from "@/services/api-service";
import {
  CREATE_STUDENT,
  DELETE_STUDENT,
  GET_STUDENTS,
  UPDATE_STUDENT,
} from "@/store/modules/student/student-types";

const studentStore = {
  actions: {
    async [CREATE_STUDENT](
      _,
      {
        firstName,
        lastName,
        studentNumber,
        collegeId,
        courseId,
        sectionId,
        type,
      }
    ) {
      try {
        const response = await apiService.post("/student", {
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber,
          college_id: collegeId,
          course_id: courseId,
          section_id: sectionId,
          account_type: type,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [UPDATE_STUDENT](
      _,
      { id, firstName, lastName, studentNumber, collegeId, courseId, sectionId }
    ) {
      try {
        const response = await apiService.put("/student", {
          id,
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber,
          college_id: collegeId,
          course_id: courseId,
          section_id: sectionId,
        });
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [GET_STUDENTS]() {
      try {
        const response = await apiService.get("/student");
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },

    async [DELETE_STUDENT](_, id) {
      try {
        const response = await apiService.delete(`/student/${id}`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

export default studentStore;
