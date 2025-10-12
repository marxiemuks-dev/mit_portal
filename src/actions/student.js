import applicantService from "../service/student.service";
import { ADD_STUDENT, GET_ALL_STUDENTS } from "./types"; // define your action types

export const addStudent = (formData) => (dispatch) => {
  return applicantService.addStudent(formData).then(
    (response) => {
      dispatch({
        type: ADD_STUDENT,
        payload: response,
      });
      return response;
    },
    (error) => {
      return error;
    }
  );
};
export const getAllStudents = () => (dispatch) => {
    return applicantService.getAllStudents()
    .then((response)=> {
        dispatch({
            type: GET_ALL_STUDENTS,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}