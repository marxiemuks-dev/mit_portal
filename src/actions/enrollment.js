import enrollmentService from "../service/enrollment.service";
import { DELETE_STUDENT_ENROLLED, ENROLL_STUDENT, GET_ALL_OFFERING, GET_STUDENT_ENROLLED, UPDATE_ENROLL_STUDENT } from "./types";

export const enrollStudent = (studentID,currentCourse,currentYearLevel,currentSemester,currentSchoolYear,enrollmentStatus,guardianEmail,studentEmail) => (dispatch) => {
  return enrollmentService.enrollStudent(studentID,currentCourse,currentYearLevel,currentSemester,currentSchoolYear,enrollmentStatus,guardianEmail,studentEmail).then(
    (response) => {
      dispatch({
        type: ENROLL_STUDENT,
        payload: response,
      });
      return response;
    },
    (error) => error
  );
};

export const getAllEnrollments = () => (dispatch) => {
 return enrollmentService.getAllEnrollments().then(
  (response) => {
    dispatch({
      type:GET_ALL_OFFERING,
      payload: response
    });
    return response;
  },
  (error) => error
 );
}

export const updateEnrollment = (selectedEnrollment) => (dispatch) => {
  return enrollmentService.updateEnrollment(selectedEnrollment.id,selectedEnrollment.current_course,selectedEnrollment.current_year_level,selectedEnrollment.current_semester,
    selectedEnrollment.current_school_year,selectedEnrollment.enrollment_status,selectedEnrollment.students.guardian_email).then(
    (response) => {
      dispatch({
        type: UPDATE_ENROLL_STUDENT,
        payload: response
      });
      return response;
    },
    (error) => error
  );
}

export const getEnrollmentsBySemesterAndYear = (semester, schoolYear) => (dispatch) => {
  return enrollmentService.getEnrollmentsBySemesterAndYear(semester,schoolYear).then(
    (response)=>{
      dispatch({
        type: GET_STUDENT_ENROLLED,
        payload: response
      });
      return response;
    },
    (error) => error
  )
}
export const getEnrollmentById = (currentUserID) => (dispatch) => {
  return enrollmentService.getEnrollmentById(currentUserID).then(
    (response)=>{
      dispatch({
        type: GET_STUDENT_ENROLLED,
        payload: response
      });
      return response;
    },
    (error) => error
  )
}
export const deleteEnrollment = (id) => (dispatch) => {
  return enrollmentService.deleteEnrollment(id).then(
    (response)=>{
      dispatch({
        type: DELETE_STUDENT_ENROLLED,
        payload: response
      });
      return response;
    },
    (error) => error
  )
}