import subjectOfferingService from "../service/subjectOffering.service";
import { ADD_STUDENT,ADD_OFFERING, GET_ALL_OFFERING } from "./types"; // define your action types

export const getAllSubjectOffering = () => (dispatch) => {
    return subjectOfferingService.getAllSubjectOffering()
    .then((response)=> {
        dispatch({
            type: GET_ALL_OFFERING,
            payload: response.data
        });
        return response
    },(error) => {
        return error
    })
}

export const addSubjectOffering = (offering) => (dispatch) => {
  return subjectOfferingService.addSubjectOffering(offering).then(
    (response) => {
      if (response.status === true) {
        dispatch({
          type: ADD_OFFERING,
          payload: response.data, // <-- new offering object
        });
      }
      return response;
    },
    (error) => {
      return error;
    }
  );
};